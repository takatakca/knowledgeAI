"use strict";
// Runs only in GitHub Actions disposable PostgreSQL. No real customer data.
const test = require("node:test");
const assert = require("node:assert/strict");
const { generateKeyPairSync, sign } = require("node:crypto");
const { Pool } = require("pg");
const { createVerifier } = require("../src/auth.cjs");
const { createService } = require("../src/service.cjs");

test("private PostgreSQL adapter isolates two real tenants and replays", {
  skip: !process.env.PRIVATE_CI_DATABASE_URL
}, async () => {
  const pool = new Pool({
    connectionString: process.env.PRIVATE_CI_DATABASE_URL,
    ssl: false, max: 2, connectionTimeoutMillis: 3000
  });
  try {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const jwk = { ...publicKey.export({ format:"jwk" }), kid:"ci-key", alg:"RS256", use:"sig" };
    const config = {issuer:"https://ci.identity.invalid", audience:"knowledge-private-ci",
      jwksUrl:"https://ci.identity.invalid/keys"};
    const verify = createVerifier(config, async()=>({keys:[jwk]}));
    const service = createService(pool, verify);
    let nonce = 0;
    function token(workspace, scopes = "knowledge:read knowledge:write") {
      nonce += 1;
      const now = Math.floor(Date.now()/1000);
      const h = Buffer.from(JSON.stringify({typ:"JWT",alg:"RS256",kid:"ci-key"})).toString("base64url");
      const p = Buffer.from(JSON.stringify({
        iss:config.issuer, aud:config.audience, sub:"ci-person-00001",
        workspace_id:workspace,product:"knowledgeai",scope:scopes,
        iat:now,exp:now+120,jti:"ci-nonce-0000000-"+nonce
      })).toString("base64url");
      const data = h+"."+p;
      return data+"."+sign("RSA-SHA256",Buffer.from(data),privateKey).toString("base64url");
    }

    const tokenA = token("tenant-aaaa");
    const first = await service.ingest(tokenA, {
      source_id:"same-source",title:"Alpha special", content:"highly private apple",
      source_url:"https://example.org/source-alpha"
    });
    assert.equal(first.inserted,true);
    await assert.rejects(service.ingest(tokenA,{
      source_id:"same-source",title:"Alpha special",content:"highly private apple",
      source_url:"https://example.org/source-alpha"
    }),error=>error.status===409);

    const second = await service.ingest(token("tenant-bbbb"), {
      source_id:"same-source",title:"Bravo special",content:"highly private banana",
      source_url:"https://example.org/source-bravo"
    });
    assert.equal(second.inserted,true);
    const readA = await service.search(token("tenant-aaaa","knowledge:read"),
      {q:"highly",limit:"20"});
    const readB = await service.search(token("tenant-bbbb","knowledge:read"),
      {q:"highly",limit:"20"});
    assert.equal(readA.results.length,1);
    assert.equal(readB.results.length,1);
    assert.match(readA.results[0].excerpt,/apple/);
    assert.doesNotMatch(readA.results[0].excerpt,/banana/);
    assert.match(readB.results[0].excerpt,/banana/);
    assert.doesNotMatch(readB.results[0].excerpt,/apple/);
    const listedA = await service.listSources(token("tenant-aaaa","knowledge:read"),{limit:"20"});
    assert.equal(listedA.results.length,2);
    assert.ok(listedA.results.some(row=>row.source_id==="same-source"));
    assert.ok(listedA.results.some(row=>row.source_id==="doc-one"));
    await assert.rejects(service.deleteSource(token("tenant-bbbb","knowledge:read"),"same-source"),
      error => error.status === 403);
    const deletionToken = token("tenant-aaaa","knowledge:delete");
    const deleted = await service.deleteSource(deletionToken,"same-source");
    assert.equal(deleted.deleted,1);
    await assert.rejects(service.deleteSource(deletionToken,"same-source"),
      error => error.status === 409);
    assert.equal((await service.search(token("tenant-aaaa","knowledge:read"),{
      q:"highly",limit:"20"
    })).results.length,0);
    assert.equal((await service.search(token("tenant-bbbb","knowledge:read"),{
      q:"highly",limit:"20"
    })).results.length,1);
    // Audit rows are intentionally not readable by the restricted service role.
    // GitHub Actions verifies them separately using migration-owner SQL.
    const injection = await service.search(token("tenant-aaaa","knowledge:read"),
      {q:"' OR 1=1 --",limit:"5"});
    assert.equal(injection.results.length,0);
    await assert.rejects(service.ingest(token("tenant-aaaa","knowledge:read"),{
      source_id:"new",title:"Denied",content:"denied",source_url:"https://example.org/"
    }),error=>error.status===403);

    // Tenant context must not survive a released pooled connection.
    const rows = await pool.query("SELECT count(*)::int AS total FROM knowledge_private.documents");
    assert.equal(rows.rows[0].total,0);
  } finally { await pool.end(); }
});
