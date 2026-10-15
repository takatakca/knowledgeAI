\set ON_ERROR_STOP on
-- Verify a disposable restore of a FULL private schema & synthetic fixture.
-- The backup was created after integration exercises write, search and delete.
DO $restore$
DECLARE
  forced integer;
BEGIN
  SELECT count(*) INTO forced
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='knowledge_private' AND c.relkind='r'
      AND c.relrowsecurity AND c.relforcerowsecurity
      AND c.relname IN ('documents','audit','write_receipts','workspace_entitlements','revoked_tokens','request_windows');
  IF forced <> 6 THEN RAISE EXCEPTION 'Recovered RLS security controls incomplete (%/6)',forced; END IF;

  IF NOT EXISTS (SELECT 1 FROM knowledge_private.documents
      WHERE workspace_id='tenant-aaaa' AND source_id='doc-one') THEN
    RAISE EXCEPTION 'Tenant A retained synthetic source missing from restore';
  END IF;
  IF EXISTS (SELECT 1 FROM knowledge_private.documents
      WHERE workspace_id='tenant-aaaa' AND source_id='same-source') THEN
    RAISE EXCEPTION 'Deleted tenant A source resurrected by restore';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM knowledge_private.documents
      WHERE workspace_id='tenant-bbbb' AND source_id='same-source') THEN
    RAISE EXCEPTION 'Tenant B synthetic source missing after restore';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM knowledge_private.workspace_entitlements
      WHERE workspace_id='tenant-cccc' AND NOT enabled) THEN
    RAISE EXCEPTION 'Disabled tenant permission state missing after restore';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM knowledge_private.revoked_tokens
      WHERE workspace_id='tenant-aaaa' AND jti='ci-revoked-credential-000001') THEN
    RAISE EXCEPTION 'Revoked token missing after restore';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM knowledge_private.audit
      WHERE workspace_id='tenant-aaaa' AND operation='delete') THEN
    RAISE EXCEPTION 'Audit history missing after restore';
  END IF;
END;
$restore$;

-- Validate recovered privileges and RLS as the actual restricted login.
SET ROLE knowledge_ci_runtime;
BEGIN;
SELECT set_config('knowledge_private.workspace_id','tenant-aaaa',true);
DO $restore$
BEGIN
  IF (SELECT count(*) FROM knowledge_private.documents) <> 1 THEN
    RAISE EXCEPTION 'Recovered tenant A RLS isolation failed';
  END IF;
  IF (SELECT count(*) FROM knowledge_private.workspace_entitlements) <> 1 THEN
    RAISE EXCEPTION 'Recovered entitlement isolation failed';
  END IF;
  IF (SELECT count(*) FROM knowledge_private.revoked_tokens) <> 1 THEN
    RAISE EXCEPTION 'Recovered revocation isolation failed';
  END IF;
  IF (SELECT count(*) FROM knowledge_private.request_windows) < 1 THEN
    RAISE EXCEPTION 'Recovered request quota state was lost';
  END IF;
END;
$restore$;
ROLLBACK;
BEGIN;
SELECT set_config('knowledge_private.workspace_id','tenant-bbbb',true);
DO $restore$
BEGIN
  IF EXISTS (SELECT 1 FROM knowledge_private.documents WHERE workspace_id='tenant-aaaa') THEN
    RAISE EXCEPTION 'Recovered tenant A source leaked into tenant B';
  END IF;
  IF (SELECT count(*) FROM knowledge_private.workspace_entitlements) <> 1 THEN
    RAISE EXCEPTION 'Recovered tenant B entitlement isolation failed';
  END IF;
END;
$restore$;
ROLLBACK;
