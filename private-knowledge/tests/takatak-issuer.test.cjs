"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {generateKeyPairSync}=require("node:crypto");
const {getKnowledgeJwks,issueKnowledgeToken}=require("../integrations/takatak-issuer.cjs");
const {createVerifier}=require("../src/auth.cjs");
const {privateKey}=generateKeyPairSync("rsa",{modulusLength:2048});
const config={
  privateKeyPem:privateKey.export({format:"pem",type:"pkcs8"}).toString(),
  issuer:"https://takatak.example",audience:"knowledge-private",
  kid:"knowledge-rs256-ci-v1"
};
const identity={
  mode:"client_scoped",profileId:"user-0123456789",
  activeClientId:"tenant-aaaa",allowedClientIds:["tenant-aaaa"]
};
const issue=(overrides={})=>issueKnowledgeToken({
  ...config,scope:"knowledge:read",
  resolveAccess:async()=>identity,
  authorizeProduct:async()=>true,
  authorizeScope:async()=>true,
  ...overrides
});
test("central TAKATAK grant signs a 60-second dedicated JWT verified by private backend",async()=>{
  const publicJwks=getKnowledgeJwks(config);
  assert.equal(publicJwks.keys.length,1);
  assert.equal(publicJwks.keys[0].kid,config.kid);
  assert.equal(Object.hasOwn(publicJwks.keys[0],"d"),false);
  assert.equal(Object.hasOwn(publicJwks.keys[0],"p"),false);
  const jwt=await issue();
  const verify=createVerifier({issuer:config.issuer,audience:config.audience,
    jwksUrl:"https://takatak.example/api/integrations/knowledgeai/jwks"},
    async()=>publicJwks);
  const principal=await verify(jwt,"knowledge:read");
  assert.equal(principal.actor,identity.profileId);
  assert.equal(principal.workspace,identity.activeClientId);
  assert.match(principal.jti,/^[A-Za-z0-9._:-]{16,128}$/);
  const claims=JSON.parse(Buffer.from(jwt.split(".")[1],"base64url"));
  assert.equal(claims.exp-claims.iat,60);
  assert.equal(claims.product,"knowledgeai");
  await assert.rejects(verify(jwt,"knowledge:write"),e=>e.status===403);
});
test("isolated master issuer refuses demo, platform-admin, invalid company and denied product",async()=>{
  for(const access of [
    {mode:"foundation_demo"}, {mode:"platform_admin",profileId:"user-0123456789"},
    {...identity,activeClientId:"tenant-bbbb"},
    {...identity,allowedClientIds:[]},
    {...identity,profileId:"short"}
  ]) await assert.rejects(issue({resolveAccess:async()=>access}),/issuance denied/);
  await assert.rejects(issue({authorizeProduct:async()=>false}),/issuance denied/);
  await assert.rejects(issue({authorizeScope:async()=>false}),/issuance denied/);
  await assert.rejects(issue({authorizeProduct:async()=>{throw Error("db down")}}),/issuance denied/);
});
test("no user-selected permission, fake signer or weak RSA key is accepted",async()=>{
  await assert.rejects(issue({scope:"knowledge:admin"}),/issuance denied/);
  await assert.rejects(issue({scope:"knowledge:write",authorizeScope:async()=>false}),/issuance denied/);
  await assert.rejects(issue({kid:"bad kid"}),/issuer configuration unavailable/);
  await assert.rejects(issue({issuer:"http://takatak.example"}),/issuer configuration unavailable/);
  const {privateKey:weak}=generateKeyPairSync("rsa",{modulusLength:1024});
  await assert.rejects(issue({privateKeyPem:weak.export({format:"pem",type:"pkcs8"}).toString()}),
    /issuer configuration unavailable/);
  await assert.rejects(issue({jti:"123"}),/issuance denied/);
});
test("scope is one approved operation only; token tampering fails private verifier",async()=>{
  const jwt=await issue({scope:"knowledge:export"});
  const verify=createVerifier({issuer:config.issuer,audience:config.audience,
    jwksUrl:"https://takatak.example/jwks"},
    async()=>getKnowledgeJwks(config));
  assert.equal((await verify(jwt,"knowledge:export")).scope,"knowledge:export");
  const p=jwt.split(".");
  const forged=JSON.parse(Buffer.from(p[1],"base64url"));
  forged.workspace_id="tenant-bbbb";
  p[1]=Buffer.from(JSON.stringify(forged)).toString("base64url");
  await assert.rejects(verify(p.join("."),"knowledge:export"),e=>e.status===401);
});

test("authorization is re-evaluated on every issuance, not cached across requests",async()=>{
  let active=true, productChecks=0, permissionChecks=0;
  const opts={
    authorizeProduct:async()=>{productChecks+=1;return active;},
    authorizeScope:async()=>{permissionChecks+=1;return active;}
  };
  const first=await issue(opts), second=await issue(opts);
  assert.notEqual(first,second);
  active=false;
  await assert.rejects(issue(opts),/issuance denied/);
  assert.equal(productChecks,3);
  assert.equal(permissionChecks,3);
});
test("JWKS key rotation invalidates old signing key and accepts new dedicated key",async()=>{
  const original=await issue();
  const {privateKey:rotatedKey}=generateKeyPairSync("rsa",{modulusLength:2048});
  const replacement={...config,kid:"knowledge-rs256-ci-v2",
    privateKeyPem:rotatedKey.export({format:"pem",type:"pkcs8"}).toString()};
  const next=await issue(replacement);
  const verify=createVerifier({issuer:config.issuer,audience:config.audience,
    jwksUrl:"https://takatak.example/new-keys"},
    async()=>getKnowledgeJwks(replacement));
  await assert.rejects(verify(original,"knowledge:read"),e=>e.status===401);
  assert.equal((await verify(next,"knowledge:read")).workspace,"tenant-aaaa");
});
