\set ON_ERROR_STOP on
-- Executed only against the disposable PostgreSQL instance created by CI.
CREATE ROLE knowledge_ci_runtime NOLOGIN;
GRANT USAGE ON SCHEMA knowledge_private TO knowledge_ci_runtime;
GRANT SELECT,INSERT,DELETE ON knowledge_private.documents TO knowledge_ci_runtime;
GRANT SELECT,INSERT ON knowledge_private.write_receipts TO knowledge_ci_runtime;
GRANT INSERT ON knowledge_private.audit TO knowledge_ci_runtime;
GRANT SELECT ON knowledge_private.workspace_entitlements TO knowledge_ci_runtime;
GRANT SELECT ON knowledge_private.revoked_tokens TO knowledge_ci_runtime;
GRANT SELECT ON knowledge_private.source_approvals TO knowledge_ci_runtime;
GRANT SELECT,INSERT,UPDATE ON knowledge_private.request_windows TO knowledge_ci_runtime;
GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA knowledge_private TO knowledge_ci_runtime;
INSERT INTO knowledge_private.documents(workspace_id,source_id,title,body,source_url,sha256,created_by)
VALUES
('tenant-aaaa','doc-one','A','private one','https://example.org/1',
 repeat('a',64),'user-ci'),
('tenant-bbbb','doc-two','B','private two','https://example.org/2',
 repeat('b',64),'user-ci');
SET ROLE knowledge_ci_runtime;
BEGIN;
SELECT set_config('knowledge_private.workspace_id','tenant-aaaa',true);
DO $test$
BEGIN
 IF (SELECT count(*) FROM knowledge_private.documents) <> 1 THEN
   RAISE EXCEPTION 'Tenant A must see exactly one document';
 END IF;
 IF (SELECT count(*) FROM knowledge_private.documents WHERE workspace_id='tenant-bbbb') <> 0 THEN
   RAISE EXCEPTION 'Tenant B leaked to A';
 END IF;
END;
$test$;
ROLLBACK;
-- Runtime may SELECT only its own control data, never change activation/revocation.
BEGIN;
SELECT set_config('knowledge_private.workspace_id','tenant-aaaa',true);
DO $test$
BEGIN
 IF (SELECT count(*) FROM knowledge_private.workspace_entitlements) <> 1 THEN
   RAISE EXCEPTION 'Admin-managed workspace controls leaked across tenant';
 END IF;
 IF (SELECT count(*) FROM knowledge_private.revoked_tokens) <> 1 THEN
   RAISE EXCEPTION 'A revoked token belonging to this tenant should be visible';
 END IF;
 BEGIN
   UPDATE knowledge_private.workspace_entitlements SET enabled=true WHERE workspace_id='tenant-cccc';
   RAISE EXCEPTION 'Runtime must not activate a workspace';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END;
$test$;
ROLLBACK;
BEGIN;
SELECT set_config('knowledge_private.workspace_id','tenant-bbbb',true);
DO $test$
BEGIN
 IF (SELECT count(*) FROM knowledge_private.documents) <> 1 THEN
   RAISE EXCEPTION 'Tenant B must see exactly one document';
 END IF;
 IF (SELECT count(*) FROM knowledge_private.documents WHERE workspace_id='tenant-aaaa') <> 0 THEN
   RAISE EXCEPTION 'Tenant A leaked to B';
 END IF;
END;
$test$;
ROLLBACK;
BEGIN;
SELECT set_config('knowledge_private.workspace_id','tenant-aaaa',true);
DO $test$
BEGIN
 BEGIN
   INSERT INTO knowledge_private.documents(workspace_id,source_id,title,body,source_url,sha256,created_by)
   VALUES('tenant-bbbb','blocked','wrong','wrong','https://example.org/3',repeat('c',64),'user-ci');
   RAISE EXCEPTION 'Cross-tenant INSERT unexpectedly succeeded';
 EXCEPTION WHEN check_violation OR insufficient_privilege THEN
   NULL;
 END;
END;
$test$;
ROLLBACK;
