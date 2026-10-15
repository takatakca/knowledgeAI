"use strict";
const { AccessError } = require("./auth.cjs");

// A valid signature is never sufficient on its own: the separate DB control
// plane must enable this workspace and allow this exact operation. Runtime
// logins are SELECT-only on these tables, so clients cannot self-entitle.
const permissionColumns = Object.freeze({
  "knowledge:read": "allow_read",
  "knowledge:write": "allow_write",
  "knowledge:delete": "allow_delete",
  "knowledge:export": "allow_export"
});

async function assertWorkspaceAccess(client, principal) {
  const column = permissionColumns[principal?.scope];
  if (!column || !principal.workspace || !principal.jti) {
    throw new AccessError("Insufficient permission", 403);
  }
  const revoked = await client.query(
    "SELECT jti FROM knowledge_private.revoked_tokens WHERE workspace_id=$1 AND jti=$2 AND expires_at>now() LIMIT 1",
    [principal.workspace,principal.jti]);
  if ((revoked.rowCount || revoked.rows?.length || 0) > 0) {
    throw new AccessError();
  }
  const access = await client.query(
    "SELECT enabled, "+column+" AS allowed FROM knowledge_private.workspace_entitlements WHERE workspace_id=$1",
    [principal.workspace]);
  if (access.rows?.length !== 1 || access.rows[0].enabled !== true ||
      access.rows[0].allowed !== true) {
    throw new AccessError("Insufficient permission", 403);
  }
}

module.exports = { assertWorkspaceAccess };
