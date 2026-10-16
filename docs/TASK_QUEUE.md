# Ordered task queue — knowledgeAI

Statuses: DONE = implemented with evidence; PENDING = executable next; BLOCKED = external dependency.

| Priority | Workstream | Status | Acceptance criteria |
| --- | --- | --- | --- |
| P0 | Public knowledge index + browser portal | DONE | Deterministic public catalog, searchable interface, 62 sources indexed, CI green |
| P0 | Public read-only agent API | DONE | GET `/api/search`, GET `/api/health`; bounded queries and provenance URLs; CI tests and deployed HTTP verification |
| P0 | Project continuity | DONE after files published | Five status/queue/handoff/deploy/decision files updated with next action |
| P1 | Public API E2E | DONE | External HTTP 200, JSON, safe input validation and production SHA evidence |
| P1 | Restricted backend architectural contract | PARTIAL — verified isolation code | Versioned TAKATAK OIDC token verification (issuer/audience/JWKS), org/product entitlement checks, audit and rate limits before query |
| P1 | Scoped durable knowledge storage | SCHEMA, RLS AND APP QUERIES TESTED; production BLOCKED | Approved private infrastructure/DB, migrations, RLS policy, backup and access controls; no fake production database |
| P1 | Private source ingestion | INGEST/SEARCH/LIST/DELETE and audit TESTED; production BLOCKED | Explicit source approvals, safe classification, normalization, idempotency, provenance and conflict tracking; prevent cross-tenant leakage |
| P2 | Authenticated retrieval for agents | BLOCKED | Real TAKATAK Auth integration, tenant-scoped tests, meaningful denial responses, API versioning |
| P2 | AI Studio production go-live | BLOCKED | Verified VPS/domain DNS, provider keys kept outside GitHub, account access and message/credit test |
| P2 | Existing PR #3/#4/#5 | PENDING coordination | Review original branches and possible conflicts; merge only validated changes without clobbering other agents |

**Do not** ingest private source material merely because a build succeeds.

Further production gates: implement approved export/data portability; defined retention for audit/receipts/backups; authoritative token revocation and membership checks; private runtime observability, backup/restore and separate hosting. The source lifecycle code and migration 002 are tested but **not live**.

Private version export: **code and synthetic CI integration DONE**, production BLOCKED. New `knowledge:export` scope, SQL-bound 10-version pagination, audit event, and tenant isolation. Requires migration 003 and a real approved trusted issuer before deployment. Remaining high-priority gaps: authoritative revocation, retention/deletion of backups and audit, secure private runtime and live end-to-end tests.

Private inventory paging: DONE IN CODE/CI (limit 1–50, offset max 999999, verified cross-tenant pagination in `38630925562`). Operations remain BLOCKED IN PRODUCTION until actual TAKATAK identity/entitlement issuer and confidential PostgreSQL are verified.

### 2026-10-15 private authorization checklist

- DONE IN CODE: deny-by-default workspace grants, JTI revocation, scoped SQL RLS, TLS/role/schema startup preflight, source-list HTTP offset regression and CI coverage.
- BLOCKED IN PRODUCTION: TAKATAK authority must provide verified membership/product entitlements and a trusted RS256 token issuer/JWKS, and must govern writes to the admin access-control tables.
- BLOCKED IN PRODUCTION: separate approved private PostgreSQL, TLS trust configuration, migration-owner + restricted runtime login, backups/recovery, access revocation operations, retention and live smoke tests.
- DO NOT interpret synthetic CI identities, hard-coded test fixture entitlements or a Vercel READY status as evidence of active confidential production ingestion.

TLS downgrade prevention: DONE IN CODE. PostgreSQL URLs with overriding SSL options are rejected and unit-tested. An approved real certificate chain and dedicated private deployment remain blocked externally.

### 2026-10-15 — backup restore readiness

- DONE IN CI: `pg_dump -Fc` and `pg_restore` to a fresh database, with post-restore
  cross-workspace RLS, audit, revocation and deletion assertions (run 38801324564).
- BLOCKED IN PRODUCTION: approved encrypted offsite backups, WAL/PITR, separate
  backup authority, key custody, retention/deletion policy, tested RPO/RTO and
  a staging restore drill using true TAKATAK entitlements.

### 2026-10-15 — tenant-scoped request quotas

- DONE IN CODE/CI: atomic DB quota windows per tenant and permission, tested
  429 denial, tenant-separated counters, FORCE RLS and restored quota state.
- PENDING PRODUCTION: apply migration 005 as approved migration owner, grant
  restricted SELECT/INSERT/UPDATE on request_windows, configure independent
  gateway abuse protection and monitor agreed limits.
- PENDING GOVERNANCE: approved expired-bucket retention and maintenance
  schedule (NO automatic deletion job exists). Do not use quotas as billing.

### 2026-10-15 — retention maintenance

- DONE IN CODE/CI: preview-first, privileged maintenance for aged quota buckets,
  replay receipts and expired token revocations with explicit two-flag opt-in,
  bounded batches, advisory locking and synthetic PostgreSQL regression tests.
- BLOCKED IN PRODUCTION: agreed retention periods, legal holds, authorized
  operator/service account, protected run logs, encrypted backups and separately
  approved scheduling. **Audit/document erasure is NOT implemented.**

### 2026-10-15 — private source approval gate

- DONE IN CODE: explicit per-workspace source approval and exact HTTPS URL
  validation before write, expiry checks, admin-only approval management,
  FORCE RLS and private synthetic integration tests (migration 006).
- STILL BLOCKED: approved TAKATAK administrative source-review/ownership and
  privacy classification workflow, real issuer, dedicated private DB and
  production ingestion/staging verification. No real confidential data loaded.

### 2026-10-15 — central TAKATAK issuer adapter

- DONE IN CODE/CI: production-gated RS256 60-second token signer, public-only
  JWKS, exact KnowledgeAI claims, fail-closed server-side workspace/product/
  permission callbacks, key rotation and synthetic verifier integration tests.
- BLOCKED for live integration: actual TAKATAK KnowledgeAI product entitlement
  definition and scoped permission policy, real server-side route and key/JWKS
  secret provisioning, signed staging token and approved private PostgreSQL.
- Never equate a passing issuer contract test with working client login.


## TAKATAK integration checkpoint

2026-10-16 P1 issuer: DRAFT TAKATAK PR #194 has explicit per-client/per-member grants, product initially planned, four scope flags, guarded signer and JWKS. Blocked on approved merge/migration, secrets, operator grant provisioning, real private DB and two-tenant staging. Must not auto-enable from CI alone.

### 2026-10-16 — TAKATAK master integration under review

- IMPLEMENTED IN DRAFT PR: [TAKATAK #195](https://github.com/takatakca/takatak-v1/pull/195) — dedicated master `knowledgeai_workspace_grants` model and migration (no default grants), explicit active product/membership/profile/client checks, 60s server-only RSA JWT, public JWKS, bounded same-origin read-only proxy (token never returned to browser), CI tests.
- PENDING: GitHub PR CI/typecheck/Prisma generation, coordinator review and merge; no production migration or secrets were applied.
- BLOCKED for private go-live: approved active product and scoped grant provisioning, independent confidential PostgreSQL+TLS (migrations 001–006), protected private deployment, authorized source approvals, backups/retention, real multi-tenant staging checks. No billable projects created.

### 2026-10-16 — Master integration consolidation gate

- DONE: TAKATAK draft PR #195 passes full CI at baseline `c4e2ee001e` (run `38884205088`); production remains OFF. Fixed cached session bypass by adding the private search route to the master high-risk route list and identity isolation regression test (source `5f76e0bee2`, CI pending).
- REQUIRED before master merge: coordinate competing PR #194 (`knowledgeai_grants` plus token endpoint) and PR #195 (`knowledgeai_workspace_grants` plus browser-safe server proxy). Select ONE canonical schema, ONE issuer/JWKS contract and carry over unique tested behaviors; do not apply both migrations.
- BLOCKED for activation: security/coordinator review, master approved product and individual grants, authorized master migration, validated private PostgreSQL + migrations 001–006, separate RLS/backup/retention, secret-managed RSA issuer/JWKS and two-tenant staging identity tests.

