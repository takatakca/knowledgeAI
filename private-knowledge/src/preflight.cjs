"use strict";

// These checks run BEFORE binding the private HTTP listener.
// Never run private production as the migration owner, superuser, RLS bypass
// or a role allowed to change its own tenant entitlements / revoked JTIs.
const expected = Object.freeze([
  "documents","write_receipts","audit","workspace_entitlements","revoked_tokens","request_windows","source_approvals"
]);
function unsafe(reason) { throw new Error("Private database preflight failed: " + reason); }

async function assertDatabaseSafety(pool, { requireTLS = true } = {}) {
  const client = await pool.connect();
  try {
    const role = await client.query(
      "SELECT rolname,rolsuper,rolbypassrls FROM pg_roles WHERE rolname=current_user");
    if (role.rows.length !== 1 || role.rows[0].rolsuper || role.rows[0].rolbypassrls) {
      unsafe("runtime role must not bypass row security");
    }
    const login = role.rows[0].rolname;
    const tables = await client.query(
      "SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity, pg_get_userbyid(c.relowner) AS owner FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=$1 AND c.relkind='r' AND c.relname = ANY($2::text[])",
      ["knowledge_private",expected]);
    if (tables.rows.length !== expected.length ||
      expected.some(name=>!tables.rows.some(t=>t.relname===name)) ||
      tables.rows.some(t=>!t.relrowsecurity || !t.relforcerowsecurity || t.owner===login)) {
      unsafe("expected FORCE RLS tables are missing or owned by runtime");
    }
    const rights = await client.query(
      "SELECT has_table_privilege(current_user,'knowledge_private.workspace_entitlements','SELECT') AS can_read_entitlements, has_table_privilege(current_user,'knowledge_private.revoked_tokens','SELECT') AS can_read_revocations, has_table_privilege(current_user,'knowledge_private.workspace_entitlements','INSERT,UPDATE,DELETE') AS can_edit_entitlements, has_table_privilege(current_user,'knowledge_private.revoked_tokens','INSERT,UPDATE,DELETE') AS can_edit_revocations, has_table_privilege(current_user,'knowledge_private.audit','SELECT') AS can_read_audit, has_table_privilege(current_user,'knowledge_private.request_windows','SELECT') AS can_read_quotas, has_table_privilege(current_user,'knowledge_private.request_windows','INSERT') AS can_insert_quotas, has_table_privilege(current_user,'knowledge_private.request_windows','UPDATE') AS can_update_quotas, has_table_privilege(current_user,'knowledge_private.request_windows','DELETE') AS can_delete_quotas, has_table_privilege(current_user,'knowledge_private.source_approvals','SELECT') AS can_read_sources, has_table_privilege(current_user,'knowledge_private.source_approvals','INSERT,UPDATE,DELETE') AS can_edit_sources");
    const p = rights.rows[0];
    if (!p?.can_read_entitlements || !p.can_read_revocations ||
      p.can_edit_entitlements || p.can_edit_revocations || p.can_read_audit ||
      !p.can_read_quotas || !p.can_insert_quotas || !p.can_update_quotas || p.can_delete_quotas ||
      !p.can_read_sources || p.can_edit_sources) {
      unsafe("runtime SQL grants must be read-only on access controls and write-only on audit");
    }
    if (requireTLS) {
      const ssl = await client.query("SELECT ssl FROM pg_stat_ssl WHERE pid=pg_backend_pid()");
      if (ssl.rows.length !== 1 || ssl.rows[0].ssl !== true) {
        unsafe("database session is not using TLS");
      }
    }
    return true;
  } finally {
    client.release();
  }
}
module.exports = { assertDatabaseSafety };
