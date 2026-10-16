"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { assertDatabaseSafety } = require("../src/preflight.cjs");
const names=["documents","write_receipts","audit","workspace_entitlements","revoked_tokens","request_windows","source_approvals"];
function mock(changes={}) {
  let released=false;
  const role={rolname:"service_login",rolsuper:false,rolbypassrls:false,...changes.role};
  const tables=changes.tables || names.map(relname=>({
    relname,relrowsecurity:true,relforcerowsecurity:true,owner:"schema_owner"
  }));
  const rights={can_read_entitlements:true,can_read_revocations:true,
    can_edit_entitlements:false,can_edit_revocations:false,can_read_audit:false,
    can_read_quotas:true,can_insert_quotas:true,can_update_quotas:true,can_delete_quotas:false,
    can_read_sources:true,can_edit_sources:false,
    ...changes.rights};
  return {
    pool:{async connect(){return {
      async query(sql){
        if(sql.includes("FROM pg_roles"))return {rows:[role]};
        if(sql.includes("FROM pg_class"))return {rows:tables};
        if(sql.includes("has_table_privilege"))return {rows:[rights]};
        if(sql.includes("FROM pg_stat_ssl"))return {rows:[{ssl:changes.tls===undefined?true:changes.tls}]};
        throw Error("unexpected query");
      },release(){released=true;}
    };}},
    released:()=>released
  };
}
test("private backend starts only when role, RLS, grants and TLS are safe",async()=>{
 const context=mock();
 assert.equal(await assertDatabaseSafety(context.pool),true);
 assert.equal(context.released(),true);
});
test("private startup fails closed on owner, missing RLS or unsafe access grants",async()=>{
 for(const changes of [
   {role:{rolsuper:true}},{role:{rolbypassrls:true}},
   {tables:names.slice(1).map(relname=>({relname,relrowsecurity:true,relforcerowsecurity:true,owner:"schema_owner"}))},
   {tables:names.map(relname=>({relname,relrowsecurity:true,relforcerowsecurity:relname!=="documents",owner:"schema_owner"}))},
   {tables:names.map(relname=>({relname,relrowsecurity:true,relforcerowsecurity:true,owner:relname==="audit"?"service_login":"schema_owner"}))},
   {rights:{can_edit_entitlements:true}},{rights:{can_edit_revocations:true}},
   {rights:{can_read_audit:true}},{rights:{can_read_entitlements:false}},
   {rights:{can_update_quotas:false}},{rights:{can_delete_quotas:true}},
   {rights:{can_read_sources:false}},{rights:{can_edit_sources:true}},
   {tls:false}
 ]) {
   const context=mock(changes);
   await assert.rejects(assertDatabaseSafety(context.pool),/preflight failed/);
   assert.equal(context.released(),true);
 }
});
