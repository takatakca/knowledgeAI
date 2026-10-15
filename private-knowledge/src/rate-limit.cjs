"use strict";
const { AccessError } = require("./auth.cjs");

// Shared across application instances via transactionally locked PostgreSQL PK.
// Deliberately hard-coded caps: untrusted requests cannot raise or disable them.
const limits = Object.freeze({
  "knowledge:read": 120,
  "knowledge:write": 30,
  "knowledge:delete": 20,
  "knowledge:export": 30
});

async function consumeWorkspaceQuota(client, principal) {
  const limit = limits[principal?.scope];
  if (!limit || typeof principal.workspace !== "string") {
    throw new AccessError("Insufficient permission",403);
  }
  const result = await client.query(
    [
      "INSERT INTO knowledge_private.request_windows",
      "(workspace_id,scope,bucket_minute,request_count)",
      "VALUES ($1,$2,date_trunc('minute',CURRENT_TIMESTAMP),1)",
      "ON CONFLICT (workspace_id,scope,bucket_minute)",
      "DO UPDATE SET request_count=knowledge_private.request_windows.request_count+1",
      "WHERE knowledge_private.request_windows.request_count<$3",
      "RETURNING request_count"
    ].join(" "),
    [principal.workspace,principal.scope,limit]
  );
  if (result.rows?.length !== 1) {
    throw new AccessError("Request quota exceeded",429);
  }
  return result.rows[0].request_count;
}
module.exports={ consumeWorkspaceQuota,limits };
