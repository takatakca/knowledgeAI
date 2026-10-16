# Confidential source approval gate — KnowledgeAI

**Status:** Implemented and tested with synthetic data in a disposable PostgreSQL 17 database. **NOT LIVE.**

## What the private service now checks

Before accepting an upload, the service verifies a signed `knowledge:write` JWT,
the current active workspace entitlement, token revocation, quota, and then
an **independent approval record** for the exact authenticated workspace,
`source_id` and HTTPS `source_url`. The approval must be explicitly enabled,
already in effect and not expired. Missing, revoked, mismatched and expired
approvals return HTTP 403 and cause the transaction to roll back.

`source_approvals` is a new FORCE RLS table in migration
`private-knowledge/migrations/006_source_approvals.sql`. Each row contains
`workspace_id`, `source_id`, `source_url`, `classification` (`public`,
`internal`, `restricted`), `approved`, `approved_by`, `approved_at`, and
`expires_at`. The normal API SQL role has **SELECT only**; it cannot
grant approval, alter classifications or extend expiration.

## Authority and operational boundary

Only a trusted TAKATAK administrative control plane or separately authorized
DB operator may create/revoke approvals, after verifying source ownership,
right to process, confidentiality classification, active client consent and
the correct workspace. This project does NOT implement that control plane.
Never accept an `approved` field or classification from an unauthenticated
web form as authorization. Do not copy real source contents into this public
GitHub repository or into the public Vercel catalog.

Revoking approval blocks **new ingestion** immediately. Previously stored
source versions are not implicitly erased: removal requires the separate
`knowledge:delete` operation and applicable retention, backups and legal-hold
procedures. Never treat this approval table as a substitute for deletion.

## Deployment and verification

1. Provision the separately approved confidential PostgreSQL database,
   migration owner, non-owner service login and TLS trust.
2. Apply migrations 001 → 002 → 003 → 004 → 005 → **006**.
3. Grant the service role SELECT on `knowledge_private.source_approvals`.
   No INSERT, UPDATE or DELETE permissions to the HTTP service role.
4. Verify actual TAKATAK-issued JWT/entitlement contract and admin source
   approval workflow. Do not seed production rows from CI fixtures.
5. Check tests for missing, disabled, expired, wrong-workspace, wrong-URL
   and approved sources; run staging restore and check persisted approvals.
6. Only then consider deploying the private backend behind its protected
   network/gateway with auditing, backups and retention.

CI synthetic fixtures are in `private-knowledge/tests/access-controls.sql`.
`private-knowledge/tests/postgres.integration.test.cjs` exercises ingestion
denials and success. `private-knowledge/tests/rls.sql` proves tenant-level
read isolation and that a runtime login cannot self-approve. The restore test
verifies approval metadata survives a full disposable database restore.

## Known limitations

- Classification labels require an approved governance policy and reviewer.
- This gate validates approval metadata; it is not malware, PII or secret scanning.
- The service does not fetch the URL; it stores provenance supplied by an
  authorized caller. The trusted control plane must validate actual source rights.
- A real provider/credential issuer, secret manager and private deployment remain
  unavailable and have not been simulated as live.
