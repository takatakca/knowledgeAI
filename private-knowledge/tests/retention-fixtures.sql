\set ON_ERROR_STOP on
-- Synthetic fixtures for a privileged, deliberately unscheduled maintenance drill.
INSERT INTO knowledge_private.request_windows
(workspace_id,scope,bucket_minute,request_count) VALUES
('tenant-aaaa','knowledge:read',date_trunc('minute',now()-interval '5 days'),4),
('tenant-bbbb','knowledge:read',date_trunc('minute',now()-interval '5 days'),2),
('tenant-cccc','knowledge:read',date_trunc('minute',now()),1)
ON CONFLICT DO NOTHING;
INSERT INTO knowledge_private.write_receipts
(workspace_id,jti,actor_id,created_at) VALUES
('tenant-aaaa','retention-old-receipt-a','synthetic',now()-interval '5 days'),
('tenant-bbbb','retention-old-receipt-b','synthetic',now()-interval '5 days'),
('tenant-cccc','retention-fresh-receipt','synthetic',now())
ON CONFLICT DO NOTHING;
INSERT INTO knowledge_private.revoked_tokens
(workspace_id,jti,expires_at) VALUES
('tenant-aaaa','retention-old-revocation-a',now()-interval '5 days'),
('tenant-bbbb','retention-old-revocation-b',now()-interval '5 days'),
('tenant-cccc','retention-fresh-revocation',now()+interval '2 hours')
ON CONFLICT DO NOTHING;
