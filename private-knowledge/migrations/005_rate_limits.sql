-- Workspace-wide per-scope quota buckets. Migration owner only, after 001-004.
BEGIN;
CREATE TABLE IF NOT EXISTS knowledge_private.request_windows (
 workspace_id text NOT NULL CHECK (workspace_id ~ '^[A-Za-z0-9_-]{8,64}$'),
 scope text NOT NULL CHECK (scope IN ('knowledge:read','knowledge:write','knowledge:delete','knowledge:export')),
 bucket_minute timestamptz NOT NULL,
 request_count integer NOT NULL DEFAULT 0 CHECK (request_count >= 0),
 PRIMARY KEY (workspace_id,scope,bucket_minute)
);
CREATE INDEX IF NOT EXISTS knowledge_request_windows_expiry_idx
 ON knowledge_private.request_windows (bucket_minute);
ALTER TABLE knowledge_private.request_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.request_windows FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rate_limit_current_workspace ON knowledge_private.request_windows;
CREATE POLICY rate_limit_current_workspace ON knowledge_private.request_windows
 USING (workspace_id = current_setting('knowledge_private.workspace_id',true))
 WITH CHECK (workspace_id = current_setting('knowledge_private.workspace_id',true));
-- Grant only SELECT, INSERT and UPDATE to the restricted app role.
-- Never give the runtime DELETE or access to other tenants' counters.
COMMIT;
