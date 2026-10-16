\set ON_ERROR_STOP on
-- Synthetic test control-plane state, written by migration owner only.
INSERT INTO knowledge_private.workspace_entitlements
  (workspace_id,enabled,allow_read,allow_write,allow_delete,allow_export)
VALUES
  ('tenant-aaaa',true,true,true,true,true),
  ('tenant-bbbb',true,true,true,true,true),
  ('tenant-cccc',false,true,true,true,true),
  ('tenant-dddd',true,true,false,false,false);
INSERT INTO knowledge_private.revoked_tokens(workspace_id,jti,expires_at)
VALUES('tenant-aaaa','ci-revoked-credential-000001',now()+interval '1 hour');

-- Control-plane operator, never the normal KnowledgeAI HTTP runtime.
INSERT INTO knowledge_private.source_approvals
(workspace_id,source_id,source_url,classification,approved,approved_by,expires_at)
VALUES
('tenant-aaaa','same-source','https://example.org/source-alpha','internal',true,'ci-control-operator',now()+interval '7 days'),
('tenant-bbbb','same-source','https://example.org/source-bravo','internal',true,'ci-control-operator',now()+interval '7 days'),
('tenant-aaaa','denied-source','https://example.org/denied','restricted',false,'ci-control-operator',now()+interval '7 days'),
('tenant-aaaa','expired-source','https://example.org/expired','internal',true,'ci-control-operator',now()-interval '1 day');
