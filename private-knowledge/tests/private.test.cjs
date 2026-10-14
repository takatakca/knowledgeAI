"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { generateKeyPairSync, sign } = require("node:crypto");
const { createVerifier, AccessError } = require("../src/auth.cjs");
const { createService, InputError, validateDocument } = require("../src/service.cjs");
const { createServer, settings } = require("../src/server.cjs");

const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength:2048 });
const jwk = { ...publicKey.export({format:"jwk"}),kid:"key-1",alg:"RS256",use:"sig" };
const config = {issuer:"https://identity.invalid",audience:"knowledge-private",
  jwksUrl:"https://identity.invalid/jwks.json"};
const now = () => Math.floor(Date.now()/1000);
const valid = () => ({iss:config.issuer,aud:config.audience,sub:"user-12345678",
  workspace_id:"tenant-a1234",product:"knowledgeai",scope:"knowledge:read knowledge:write",
  iat:now(),exp:now()+60,jti:"nonce-123456789012"});
function makeJwt(claims = valid(), header = {typ:"JWT",alg:"RS256",kid:"key-1"}) {
  const encode = obj => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const payload = encode(header)+"."+encode(claims);
  return payload+"."+sign("RSA-SHA256", Buffer.from(payload),privateKey).toString("base64url");
}
const verifier = createVerifier(config,async()=>({keys:[jwk]}));
test("verifies signed short-lived dedicated access with scope",async()=>{
  const user = await verifier(makeJwt(),"knowledge:read");
  assert.equal(user.workspace,"tenant-a1234");
  assert.equal(user.actor,"user-12345678");
  assert.equal(user.scope,"knowledge:read");
});
test("rejects forged algorithm, signatures, audience, tenant and expiration",async()=>{
  const invalid = [
    makeJwt(valid(),{typ:"JWT",alg:"none",kid:"key-1"}),
    makeJwt({...valid(),aud:"other-audience"}),
    makeJwt({...valid(),product:"other-product"}),
    makeJwt({...valid(),workspace_id:""}),
    makeJwt({...valid(),exp:now()-1}),
    makeJwt({...valid(),iat:now()-400,exp:now()+1}),
    makeJwt({...valid(),scope:"knowledge:read"})
  ];
  for(const jwt of invalid){
    await assert.rejects(verifier(jwt,"knowledge:write"),AccessError);
  }
  const token=makeJwt();const parts=token.split(".");
  parts[1] = Buffer.from(JSON.stringify({...valid(),workspace_id:"tenant-b1234"})).toString("base64url");
  await assert.rejects(verifier(parts.join("."),"knowledge:read"),AccessError);
  await assert.rejects(verifier("not-a-jwt","knowledge:read"),AccessError);
});
test("fails closed when a JWKS authority is not configured or reachable",async()=>{
  assert.throws(()=>createVerifier({issuer:"x",audience:"y",jwksUrl:"http://localhost"}));
  const down = createVerifier(config,async()=>{throw new Error("unavailable")});
  await assert.rejects(down(makeJwt(),"knowledge:read"),e=>e.status===503);
});
test("document validation constrains provenance and content",()=>{
  const doc=validateDocument({source_id:"repo:doc-1",title:"Title",content:"body",
    source_url:"https://example.org/a"});
  assert.equal(doc.hash.length,64);
  assert.throws(()=>validateDocument({source_id:"x",title:"T",content:"secret",source_url:"http://unsafe"}),InputError);
  assert.throws(()=>validateDocument({source_id:"x",title:"T",content:"x".repeat(66000),
    source_url:"https://example.org"}),InputError);
});

function fakePool(){
 const calls=[]; let fail=false;
 return {
  calls,
  async connect(){return {
    async query(sql,params){
      calls.push({sql,params});
      if(fail && sql.includes("knowledge_private.audit")) throw new Error("db failed");
      if(sql.includes("write_receipts"))return {rowCount:1,rows:[{jti:"nonce"}]};
      if(sql.includes("knowledge_private.documents")&&sql.startsWith("INSERT")) return {rowCount:1,rows:[{id:1}]};
      return {rowCount:1,rows:[]};
    },
    release(){calls.push({sql:"RELEASE"})}
  };},
  forceFailure(){fail=true;}
 };
}
test("sets transaction-local workspace from verified token, never request body",async()=>{
 const db=fakePool();const app=createService(db,verifier);
 const result=await app.ingest(makeJwt(),{source_id:"repo:1",title:"Example",
   content:"private content",source_url:"https://example.org/source"});
 assert.equal(result.inserted,true);
 const binding=db.calls.find(x=>x.sql.includes("set_config"));
 assert.deepEqual(binding.params,["tenant-a1234"]);
 assert.ok(db.calls.some(x=>x.sql==="COMMIT"));
 assert.ok(db.calls.some(x=>x.sql.includes("write_receipts")));
 assert.ok(db.calls.some(x=>x.sql.includes("knowledge_private.audit")));
 assert.ok(db.calls.some(x=>x.sql==="RELEASE"));
});
test("failure rolls back tenant-local operations and releases connection",async()=>{
 const db=fakePool();db.forceFailure();const app=createService(db,verifier);
 await assert.rejects(app.ingest(makeJwt(),{source_id:"repo:1",title:"T",content:"private",
   source_url:"https://example.org"}));
 assert.ok(db.calls.some(x=>x.sql==="ROLLBACK"));
 assert.ok(db.calls.some(x=>x.sql==="RELEASE"));
 assert.ok(!db.calls.some(x=>x.sql==="COMMIT"));
});
test("search only uses verified workspace and parameterized SQL",async()=>{
 const db=fakePool();const app=createService(db,verifier);
 const result=await app.search(makeJwt(),{q:"quoted ' term",limit:"5"});
 assert.equal(result.visibility,"private");
 assert.deepEqual(db.calls.find(x=>x.sql.includes("set_config")).params,["tenant-a1234"]);
 const query=db.calls.find(x=>x.sql.includes("websearch_to_tsquery"));
 assert.deepEqual(query.params,["quoted ' term",5]);
 assert.ok(query.sql.includes("$1"));
 await assert.rejects(app.search(makeJwt(),{q:"x",limit:"1000"}),InputError);
});
test("HTTP layer requires bearer token, blocks write routes without token",async()=>{
 const pool={query:async()=>({rows:[{one:1}]})};
 const app=createServer({search:async()=>({visibility:"private",results:[]}),
   ingest:async()=>({inserted:true})},pool);
 await new Promise(resolve=>app.listen(0,"127.0.0.1",resolve));
 try{
  const base="http://127.0.0.1:"+app.address().port;
  const health=await fetch(base+"/healthz");
  assert.equal(health.status,200);
  const unauth=await fetch(base+"/v1/knowledge/search?q=x");
  assert.equal(unauth.status,401);
  const bad=await fetch(base+"/v1/knowledge/documents",{method:"POST"});
  assert.equal(bad.status,401);
  const duplicate=await fetch(base+"/v1/knowledge/search?q=a&q=b",{
    headers:{Authorization:"Bearer mock-token"}});
  assert.equal(duplicate.status,400);
  const notFound=await fetch(base+"/v1/knowledge/missing",{
    headers:{Authorization:"Bearer mock-token"}});
  assert.equal(notFound.status,404);
 }finally{await new Promise(resolve=>app.close(resolve));}
});
test("tenant source lifecycle requires distinct signed scopes and jti",async()=>{
 const db=fakePool(), svc=createService(db,verifier);
 await svc.listSources(makeJwt(),{limit:"2"});
 assert.ok(db.calls.some(x=>x.sql.includes("LIMIT $1") && x.params?.[0]===2));
 assert.ok(db.calls.some(x=>x.sql.includes("'list'")));
 db.calls.length=0;
 const result=await svc.deleteSource(makeJwt(),"repo:1");
 assert.equal(result.source_id,"repo:1");
 assert.ok(db.calls.some(x=>x.sql.startsWith("DELETE FROM knowledge_private.documents")));
 assert.ok(db.calls.some(x=>x.sql.includes("'delete'")));
 assert.ok(db.calls.some(x=>x.sql.includes("write_receipts")));
 await assert.rejects(svc.listSources(makeJwt(),{limit:"5000"}),InputError);
});
test("lifecycle HTTP paths reject malformed source filters",async()=>{
 const pool={query:async()=>({rows:[{one:1}]})};
 const app=createServer({
  search:async()=>({visibility:"private",results:[]}),
  ingest:async()=>({inserted:true}),
  listSources:async()=>({visibility:"private",results:[]}),
  deleteSource:async()=>({deleted:0,source_id:"s"})
 },pool);
 await new Promise(resolve=>app.listen(0,"127.0.0.1",resolve));
 try{
  const base="http://127.0.0.1:"+app.address().port;
  const authorization={Authorization:"Bearer synthetic-token"};
  assert.equal((await fetch(base+"/v1/knowledge/sources",{headers:authorization})).status,200);
  assert.equal((await fetch(base+"/v1/knowledge/sources?source_id=s",{method:"DELETE",headers:authorization})).status,200);
  assert.equal((await fetch(base+"/v1/knowledge/sources?source_id=a&source_id=b",{method:"DELETE",headers:authorization})).status,400);
  assert.equal((await fetch(base+"/v1/knowledge/sources",{method:"DELETE",headers:authorization})).status,400);
  assert.equal((await fetch(base+"/v1/knowledge/sources?limit=1&limit=2",{headers:authorization})).status,400);
 } finally {await new Promise(resolve=>app.close(resolve));}
});
test("production configuration fails closed without independent database and identity",()=>{
 assert.throws(()=>settings({}),/configuration missing/);
 assert.throws(()=>settings({PRIVATE_DATABASE_URL:"postgres://test",KNOWLEDGE_JWT_ISSUER:"x",
   KNOWLEDGE_JWT_AUDIENCE:"y",KNOWLEDGE_JWKS_URL:"http://localhost"}),/JWKS requires HTTPS/);
});
