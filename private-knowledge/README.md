# KnowledgeAI private service — isolated, NOT DEPLOYED

This directory contains independent backend code for a future APPROVED confidential KnowledgeAI environment. It is NOT included in the Vercel public search API and has NO live private customer records, passwords, identity secrets or production database.

## Implemented code

- RS256 JWT signature validation against an explicitly configured HTTPS JWKS endpoint; exact issuer/audience, product = knowledgeai, verified workspace_id, scope, short expiration (max 300 seconds), and token jti required.
- PostgreSQL transaction-bound workspace context, FORCE ROW LEVEL SECURITY on documents, anti-replay receipts and audit.
- POST /v1/knowledge/documents accepts JSON fields: source_id, title, content and HTTPS source_url. Server calculates SHA-256 and deduplicates by workspace/source/hash. Write token jti can only be used once.
- GET /v1/knowledge/search?q=term&limit=20 returns only source records from the workspace authenticated by the JWT.
- GET /v1/knowledge/sources?limit=20&offset=0 returns latest source metadata only for the authorized workspace, with SQL-bound pages (limit 1–50, offset 0–999999). Enumerate successive pages before exporting; no full document bodies in inventory.
- GET /v1/knowledge/export?source_id=...&limit=10&offset=0 returns complete original content for up to 10 source versions per page, **only** within the verified workspace and only with a JWT scope of knowledge:export. All successful exports create an audit entry; export is intended for an approved client transfer, not public search.
- DELETE /v1/knowledge/sources?source_id=... removes every version of that source **only** for the verified workspace; requires dedicated knowledge:delete scope and a single-use JWT jti.
- Successful search, source-list and source-deletion operations are logged as scoped audit events without storing search terms.
- GET /healthz checks the private database connection (not a full identity-provider readiness check).
- HTTP binds to 127.0.0.1 by default and does not enable CORS.
- Private Knowledge Security CI verifies authentication, input validation and transaction handling with synthetic data; disposable PostgreSQL 17 tests check tenant RLS.

## Verified developer commands

From the repository root:

    node --test private-knowledge/tests/private.test.cjs
    node --check private-knowledge/src/auth.cjs
    node --check private-knowledge/src/service.cjs
    node --check private-knowledge/src/server.cjs

The CI PostgreSQL job applies migrations/001_private_knowledge.sql, 002_source_lifecycle.sql AND 003_export_audit.sql, runs tests/rls.sql and tests/lifecycle-audit.sql, and checks migration reapplication. CI test data is synthetic, never real client content. An additional integration test runs ingestion and tenant-scoped retrieval against real PostgreSQL 17 as a restricted login, including cross-workspace and replay checks.

## NOT YET production-ready: required rollout steps

1. Approve and provision a dedicated confidential PostgreSQL database. Do not reuse unrelated TAKATAK or client databases.
2. Apply ALL THREE migrations in order (001_private_knowledge.sql, then 002_source_lifecycle.sql, then 003_export_audit.sql) as a migration-owner role, then create a separate app login without SUPERUSER/BYPASSRLS and which does not own these tables.
3. Grant that login the least privilege required: USAGE on schema; SELECT/INSERT/DELETE on documents, SELECT/INSERT on write_receipts; INSERT on audit; USAGE/SELECT on schema sequences.
4. Have TAKATAK's trusted server verify a real authenticated user's workspace membership, active product entitlement, and least-privilege permission. Only then issue a short-lived KnowledgeAI-specific RS256 JWT. This repository does not implement the trusted issuer. The unrelated Bluesky JWKS endpoint in TAKATAK is NOT suitable.
5. Configure the confidential runtime through its secret manager, never GitHub:
   - PRIVATE_DATABASE_URL (restricted non-owner login)
   - KNOWLEDGE_JWT_ISSUER (verified authority)
   - KNOWLEDGE_JWT_AUDIENCE (private-service audience)
   - KNOWLEDGE_JWKS_URL (actual trusted HTTPS public keys)
   - PRIVATE_PORT (optional, default 8301)
6. On approved server: install Node 22+, run npm ci --omit=dev --ignore-scripts in this directory, and npm start. The committed package-lock.json locks pg and its transitive dependencies; CI verifies npm ci, npm audit (high severity threshold), and real PostgreSQL integration tests.
7. Put service behind a private network/authenticated gateway. Verify real 401/403 responses, JWT rotation, two-company row isolation, audit, backup, retention, restore, disclosure approval and signed entitlements before enabling real imports.

## Security and operational limits

- The service verifies cryptographically signed authorization claims; it cannot verify changes to workspace membership or entitlements until the trusted issuer and revocation contract exist.
- Do not expose or proxy this service from the public Vercel project or accept private source material at /api/search.
- Audit and receipt retention/deletion jobs, customer data export, connection encryption verification, database monitoring, disaster recovery and regulatory compliance need approved production implementation.
- source_url is stored as source provenance; it is never fetched by this service, to avoid arbitrary URL ingestion.
- Read tokens are reusable for the short JWT lifetime. Write receipts prevent duplicated state-changing use of the same jti within a workspace.
- This is PostgreSQL text search, not an AI embedding/vector search service. AI Studio remains a distinct unverified VPS deployment kit.

The target architecture remains TAKATAK-managed identity federation with independently transferable client records and strict isolation of each organization's knowledge.

## Lifecycle operations and data-retention caveats

A scoped delete removes source revisions within one workspace in a single transaction; it does not erase source identifiers from the immutable audit log or delete separately managed backups. Client privacy/offboarding policies must define audit and backup retention, legal holds, and secure export before any production customer data is ingested. The service does not grant audit-table SELECT to its runtime SQL login; the disposable PostgreSQL test verifies audit evidence as the migration owner. No production removal/retention job is installed.

## Client source transfer / export (not live)

An authorized client export requires a dedicated `knowledge:export` signed scope and the workspace from the token, not an HTTP parameter. Call `GET /v1/knowledge/export?source_id=...&limit=10&offset=0`; advance offset by page size. The response contains full original document version bodies and provenance, so transmit only through a verified private gateway; never enable public caching, log bodies, or send exports to the public KnowledgeAI search API. This feature has **synthetic PostgreSQL 17 integration evidence only**; it is not available to live clients until the actual TAKATAK issuer, revocation, private DB, encryption, tenant data rights and retention requirements are verified.

## Workspace grants, token revocation and startup safety (2026-10-15)

Migration `004_workspace_access.sql` adds two owner-managed tables: `workspace_entitlements` (disabled by default, per-operation allow flags) and `revoked_tokens` (workspace/JTI with token expiry). Every private data operation validates a signed JWT, then queries these tables **in the same workspace transaction**. The runtime login must only SELECT the control tables; it cannot add its own entitlement or remove a revocation. Real entitlements and revocations must be supplied by the trusted TAKATAK control plane after checking actual user membership and product rights.

Production `npm start` now runs a fail-closed DB preflight before opening port 8301: correct non-owner/no-BYPASSRLS SQL role, all five FORCE RLS tables, safe grants, and a TLS PostgreSQL connection. It does not silently accept a plaintext production database. Migrations must be applied in order: 001, 002, 003, 004. The disposable PostgreSQL CI does not use TLS; it expressly tests that normal production preflight rejects this and only overrides TLS within a direct CI test call, not server boot. No production database or TAKATAK issuer was provisioned in this session.
