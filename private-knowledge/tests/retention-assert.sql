\set ON_ERROR_STOP on
\if :{?expect_pruned}
\else
  \echo 'Missing required expect_pruned=true/false'
  \quit 2
\endif
SELECT set_config('ci.expect_pruned', :'expect_pruned', false);
DO $test$
DECLARE old_windows integer; old_receipts integer; old_revocations integer;
BEGIN
 SELECT count(*) INTO old_windows FROM knowledge_private.request_windows
  WHERE workspace_id IN ('tenant-aaaa','tenant-bbbb')
    AND bucket_minute < now()-interval '48 hours';
 SELECT count(*) INTO old_receipts FROM knowledge_private.write_receipts
  WHERE jti LIKE 'retention-old-receipt-%';
 SELECT count(*) INTO old_revocations FROM knowledge_private.revoked_tokens
  WHERE jti LIKE 'retention-old-revocation-%';
 IF current_setting('ci.expect_pruned')='true' THEN
   IF old_windows<>0 OR old_receipts<>0 OR old_revocations<>0 THEN
     RAISE EXCEPTION 'Old retention artifacts remain after approved batch (% % %)',
       old_windows,old_receipts,old_revocations;
   END IF;
 ELSE
   IF old_windows<>2 OR old_receipts<>2 OR old_revocations<>2 THEN
     RAISE EXCEPTION 'Preview changed retention artifacts (% % %)',
       old_windows,old_receipts,old_revocations;
   END IF;
 END IF;
 IF NOT EXISTS(SELECT 1 FROM knowledge_private.request_windows
                WHERE workspace_id='tenant-cccc' AND bucket_minute>now()-interval '1 hour') THEN
   RAISE EXCEPTION 'Current quota bucket deleted';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM knowledge_private.write_receipts
                WHERE jti='retention-fresh-receipt') THEN
   RAISE EXCEPTION 'Current anti-replay receipt deleted';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM knowledge_private.revoked_tokens
                WHERE jti='retention-fresh-revocation') THEN
   RAISE EXCEPTION 'Unexpired token revocation deleted';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM knowledge_private.documents
                WHERE workspace_id='tenant-bbbb' AND source_id='same-source') THEN
   RAISE EXCEPTION 'Live document incorrectly changed';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM knowledge_private.audit
                WHERE workspace_id='tenant-aaaa' AND operation='delete') THEN
   RAISE EXCEPTION 'Audit trail incorrectly changed';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM knowledge_private.workspace_entitlements
                WHERE workspace_id='tenant-cccc' AND NOT enabled) THEN
   RAISE EXCEPTION 'Entitlement incorrectly changed';
 END IF;
END;
$test$;
