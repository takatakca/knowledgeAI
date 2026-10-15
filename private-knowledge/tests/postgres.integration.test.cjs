"use strict";
// Runs only in GitHub Actions disposable PostgreSQL. No real customer data.
const test = require("node:test");
const assert = require("node:assert/strict");
const { generateKeyPairSync, sign } = require("node:crypto");
const { Pool } = require("pg");
const { createVerifier } = require("../src/auth.cjs");
const { createService } = require("../src/service.cjs");
const { assertDatabaseSafety } = require("../src/preflight.cjs");

test("private PostgreSQL adapter isolates two real tenants and replays", {
  skip: !process.env.PRIVATE_CI_DATABASE_URL
}, async () => {
  const pool = new Pool({
    connectionString: process.env.PRIVATE_CI_DATABASE_URL,
    ssl: false, max: 2, connectionTimeoutMillis: 3000
  });
  try {
    // Disposable local PostgreSQL uses plaintext by design: production preflight
    // must reject it, and the CI-only override verifies the remaining controls.
    await assert.rejects(assertDatabaseSafety(pool),/database session is not using TLS/);
    assert.equal(await assertDatabaseSafety(pool,{requireTLS:false}),true);
    const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const jwk = { ...publicKey.export({ format:"jwk" }), kid:"ci-key", alg:"RS256", use:"sig" };
    const config = {issuer:"https://ci.identity.invalid", audience:"knowledge-private-ci",
      jwksUrl:"https://ci.identity.invalid/keys"};
    const verify = createVerifier(config, async()=>({keys:[jwk]}));
    const service = createService(pool, verify);
    let nonce = 0;
    function token(workspace, scopes = "knowledge:read knowledge:write", fixedJti) {
      nonce += 1;
      const now = Math.floor(Date.now()/1000);
      const h = Buffer.from(JSON.stringify({typ:"JWT",alg:"RS256",kid:"ci-key"})).toString("base64url");
      const p = Buffer.from(JSON.stringify({
        iss:config.issuer, aud:config.audience, sub:"ci-person-00001",
        workspace_id:workspace,product:"knowledgeai",scope:scopes,
        iat:now,exp:now+120,jti:fixedJti || "ci-nonce-0000000-"+nonce
      })).toString("base64url");
      const data = h+"."+p;
      return data+"."+sign("RSA-SHA256",Buffer.from(data),privateKey).toString("base64url");
    }

    // A correctly signed token is not sufficient without a current, admin-managed
    // workspace entitlement and the absence of an active revocation.
    await assert.rejects(
      service.search(token("tenant-cccc","knowledge:read"),{q:"",limit:"1"}),
      error => error.status === 403);
    await assert.rejects(
      service.search(token("tenant-zzzz","knowledge:read"),{q:"",limit:"1"}),
      error => error.status === 403);
    await assert.rejects(
      service.search(token("tenant-aaaa","knowledge:read",
        "ci-revoked-credential-000001"),{q:"",limit:"1"}),
      error => error.status === 401);
    await assert.rejects(
      service.ingest(token("tenant-dddd","knowledge:write"),{
        source_id:"blocked",title:"No write access",content:"denied",
        source_url:"https://example.org/blocked"
      }),
      error => error.status === 403);
    assert.equal((await service.search(token("tenant-dddd","knowledge:read"),{
      q:"",limit:"1"
    })).results.length,0);
    // Revocation is workspace-scoped, not a global accidental block.
    assert.equal((await service.search(token("tenant-bbbb","knowledge:read",
      "ci-revoked-credential-000001"),{q:"",limit:"1"})).visibility,"private");
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
    const newer = await service.ingest(token("tenant-aaaa"), {
      source_id:"same-source",title:"Alpha newer",content:"highly private apple updated",
      source_url:"https://example.org/source-alpha"
    });
    assert.equal(newer.inserted,true);
    const exported = await service.exportSource(token("tenant-aaaa","knowledge:export"),
      "same-source",{limit:"10",offset:"0"});
    assert.equal(exported.versions.length,2);
    assert.ok(exported.versions.every(v => v.body.includes("apple")));
    assert.ok(exported.versions.every(v => !v.body.includes("banana")));
    assert.equal((await service.exportSource(token("tenant-bbbb","knowledge:export"),
      "same-source",{limit:"10",offset:"0"})).versions.length,1);
    await assert.rejects(service.exportSource(token("tenant-aaaa","knowledge:read"),
      "same-source",{limit:"10",offset:"0"}),error=>error.status===403);
    const listedA = await service.listSources(token("tenant-aaaa","knowledge:read"),{limit:"20",offset:"0"});
    const pageOne = await service.listSources(token("tenant-aaaa","knowledge:read"),{limit:"1",offset:"0"});
    const pageTwo = await service.listSources(token("tenant-aaaa","knowledge:read"),{limit:"1",offset:"1"});
    assert.equal(pageOne.results.length,1);
    assert.equal(pageTwo.results.length,1);
    assert.notEqual(pageOne.results[0].source_id,pageTwo.results[0].source_id);
    assert.equal(listedA.results.length,2);
    assert.ok(listedA.results.some(row=>row.source_id==="same-source"));
    assert.ok(listedA.results.some(row=>row.source_id==="doc-one"));
    await assert.rejects(service.deleteSource(token("tenant-bbbb","knowledge:read"),"same-source"),
      error => error.status === 403);
    const deletionToken = token("tenant-aaaa","knowledge:delete");
    const deleted = await service.deleteSource(deletionToken,"same-source");
    assert.equal(deleted.deleted,2);
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
