"use strict";
const { AccessError } = require("./auth.cjs");

// This checks approval for the exact source ID + URL within the verified tenant.
// App service may SELECT only; approved_by and the classification are set by
// TAKATAK's future audited control plane, never by client-supplied JSON.
async function assertSourceApproved(client, principal, source) {
  if (!source || typeof source.sourceId !== "string" ||
      typeof source.sourceUrl !== "string" || !principal?.workspace) {
    throw new AccessError("Source approval required",403);
  }
  const result = await client.query(
    "SELECT classification FROM knowledge_private.source_approvals "+
    "WHERE workspace_id=$1 AND source_id=$2 AND source_url=$3 "+
    "AND approved=true AND approved_at<=CURRENT_TIMESTAMP "+
    "AND expires_at>CURRENT_TIMESTAMP LIMIT 1",
    [principal.workspace,source.sourceId,source.sourceUrl]
  );
  if (result.rows?.length !== 1) throw new AccessError("Source approval required",403);
  return result.rows[0].classification;
}
module.exports = { assertSourceApproved };
