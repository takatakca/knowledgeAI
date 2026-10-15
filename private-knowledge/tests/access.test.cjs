"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { assertWorkspaceAccess } = require("../src/access.cjs");

function client(state) {
  const calls = [];
  return {
    calls,
    async query(sql,params) {
      calls.push({sql,params});
      if (sql.includes("FROM knowledge_private.workspace_entitlements"))
        return {rows:state.entitlement === undefined ? [] :
          [{enabled:state.entitlement.enabled,allowed:state.entitlement.allowed}],rowCount:1};
      if (sql.includes("FROM knowledge_private.revoked_tokens"))
        return {rows:state.revoked ? [{jti:params[1]}] : [],rowCount:state.revoked?1:0};
      throw Error("unexpected query");
    }
  };
}
const principal = Object.freeze({workspace:"tenant-aaaa",jti:"not-revoked-token-00001",scope:"knowledge:read"});
test("valid signature alone does not permit unknown, disabled or unentitled workspace",async()=>{
  for(const entitlement of [undefined,{enabled:false,allowed:true},{enabled:true,allowed:false}]){
    await assert.rejects(assertWorkspaceAccess(client({entitlement,revoked:false}),principal),
      error=>error.status===403);
  }
});
test("active revoked jti fails even with tenant entitlement",async()=>{
  await assert.rejects(assertWorkspaceAccess(client({
    entitlement:{enabled:true,allowed:true},revoked:true
  }),principal),error=>error.status===401);
});
test("allows only known scope names and transaction-scoped query parameters",async()=>{
  const db=client({entitlement:{enabled:true,allowed:true},revoked:false});
  await assertWorkspaceAccess(db,principal);
  assert.ok(db.calls.every(c=>c.params[0]==="tenant-aaaa"));
  assert.equal(db.calls.find(c=>c.sql.includes("revoked_tokens")).params[1],principal.jti);
  await assert.rejects(assertWorkspaceAccess(db,{...principal,scope:"unknown;DROP TABLE"}),
    error=>error.status===403);
});
