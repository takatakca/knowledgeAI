# Deployment runbook — knowledgeAI

## Verified topology (2026-10-14)

- Repository: \`https://github.com/takatakca/knowledgeAI\` (public), publication branch: \`main\`.
- Portal: Git-linked Vercel project \`knowledgeai\`.
- Production alias: \`https://knowledgeai-nu.vercel.app\`.
- Vercel production deployment for SHA `4ca3ad226a56a3df0fb5fe88e090f723c5821ffe` was **READY** and external GitHub runner HTTP smoke verified four routes on 2026-10-14 (GitHub Actions run `38623184283`).
- GitHub Actions \`Knowledge Catalog CI\` runs Python tests, builds catalog and publishes refreshed \`knowledge-catalog.json\` to \`main\`.
- Vercel may create two releases per content change: the author's commit and the catalog bot commit.

## Deploy and smoke checks

1. Push authorized, reviewed changes to \`main\` (never force-push).
2. Open GitHub **Actions → Knowledge Catalog CI**. Require successful unit tests and index generation.
3. GitHub CI now includes an automatic external HTTPS smoke job after catalog publishing. Check it passed; if it fails, fix Vercel routes/domain/authorization before claiming production. Check whether the catalog bot pushed a follow-up commit; use its SHA as the final production target.
4. Inspect the \`knowledgeai\` project on Vercel; verify \`READY\` **and** \`githubCommitSha\` matches the target branch.
5. From an external browser or curl, verify:
   \`\`\`sh
   curl -i https://knowledgeai-nu.vercel.app/
   curl -i https://knowledgeai-nu.vercel.app/knowledge-catalog.json
   curl -i https://knowledgeai-nu.vercel.app/api/health
   curl -i 'https://knowledgeai-nu.vercel.app/api/search?q=TAKATAK&limit=3'
   curl -i -X POST https://knowledgeai-nu.vercel.app/api/search
   \`\`\`
   Expect HTML 200; catalog JSON version 1; health JSON 200 \`status=ok\`; search JSON 200 with real source URLs; POST 405.
6. If Vercel returns READY but external access fails, diagnose routing/domain/SSO/dns before declaring public release successful.
7. When reversing code, restore a known-good Git commit, let GitHub/Vercel redeploy and verify the final alias; do not force-push.

## CI commands (local)

\`\`\`sh
python3 -m unittest discover -s ingest/tests -v
python3 ingest/build_catalog.py
python3 ingest/build_catalog.py --check
node --test tests/public-api.test.cjs
node --check api/search.js
node --check api/health.js
\`\`\`

## Non-public AI Studio

\`deploy/ai-studio/\` is a separate VPS kit, **not deployed by Vercel**. Follow its existing runbook only after server/DNS/API-keys and costs are approved. Never commit \`.env\`, passwords or downloaded client data.

## Concurrency recovery (verified 2026-10-14)

Parallel source edits can race with the catalog bot. The publish job now fetches the latest `main`, resets **only its ephemeral runner checkout**, regenerates `knowledge-catalog.json`, and retries a normal push. No force-push or destructive remote reset is used. If retries exhaust, inspect GitHub logs and re-run only after reconciling newer source changes. Verified successful production smoke after this fix: GitHub Actions run `38623893521`.

## Private backend — separate non-public deployment

Do not deploy private-knowledge/ to Vercel public portal. It is a future isolated server, requiring the approved credential issuer, dedicated private PostgreSQL instance, RLS runtime role, secure network/proxy and backup/retention. Current evidence is synthetic JWT unit tests and a disposable PostgreSQL 17 RLS CI test. The service does not claim production availability. See private-knowledge/README.md.

## Latest reproducible private-service security checks

CI run 38627614637 succeeded. The separate Private Knowledge Security CI checks JWT verifier syntax/tests, PostgreSQL 17 migration and FORCE RLS, cross-tenant restricted-role ingestion/search, replay denial, deterministic npm ci using private-knowledge/package-lock.json, and npm audit of production packages at high severity threshold. The private service is STILL NOT deployed; Vercel is only for the public corpus/API.

## Private lifecycle migration 002

After applying migration 001 in a separately approved private PostgreSQL DB, apply `private-knowledge/migrations/002_source_lifecycle.sql`. Provision the restricted runtime role with SELECT/INSERT/DELETE on documents, SELECT/INSERT on write_receipts, INSERT on audit (not SELECT), plus sequence and schema permissions. Verify all tenant cross-access tests. There is **no automatic private production deployment**; public Vercel remains a separate read-only service. Evidence: Private Knowledge Security CI run 38629828659.

## New private export migration (2026-10-14)

Apply `private-knowledge/migrations/003_export_audit.sql` after 001 and 002. Export is served only by the isolated private server, using `knowledge:export`, 10-version maximum pagination and audit. CI run `38630318645` passes synthetic two-tenant export isolation; **there is no production deployment** for this API. Public Vercel remains independent and cannot access confidential records.

## Source pagination validation

Latest private CI run `38630925562` verified SQL-bounded inventory pagination with restricted PostgreSQL roles and source export. Do NOT publish this private API to the public Vercel site. Migration prerequisites remain 001→002→003 and confidential TAKATAK-authenticated service infrastructure.

## 2026-10-15 — migration 004 and private startup gate

1. Apply **001 → 002 → 003 → 004** in a dedicated approved private PostgreSQL as migration owner. Never apply private migrations to unrelated TAKATAK/customer projects.
2. The authorized TAKATAK backend or its privileged database operator must explicitly insert/update `workspace_entitlements` for each verified active workspace. All booleans default false. To revoke a particular still-valid JWT, write its `workspace_id`, `jti` and expiration into `revoked_tokens` from a trusted control-plane identity. Never expose these admin writes to the normal service role.
3. Grant the distinct non-owner runtime login SELECT only on `workspace_entitlements` and `revoked_tokens`; allow only previously documented tenant RLS data access, and INSERT-only on audit.
4. Before HTTP bind, private `assertDatabaseSafety()` now rejects privileged ownership, RLS not forced, unsafe SQL grants, or PostgreSQL plaintext sessions. Configure a verified TLS CA through protected host settings. Startup must fail if configuration is not ready.
5. Tests: `node --test private-knowledge/tests/private.test.cjs private-knowledge/tests/access.test.cjs private-knowledge/tests/preflight.test.cjs`; the Private Knowledge Security CI runs a disposable PostgreSQL instance and live restricted-role checks.
6. Actual private deployment remains unapproved and unconfigured. Vercel must continue serving only the public knowledge catalog.

## PostgreSQL DSN TLS safety — 2026-10-15

Private startup now rejects URLs containing `sslmode`, `sslcert`, `sslkey`, `sslrootcert` or `ssl` parameters, because database connection-string parsing can override the strict TLS settings on the Node PostgreSQL client. Supply a clean `postgresql://` connection URL via protected secrets and configure a trusted CA at the host TLS trust layer when necessary; never set `NODE_TLS_REJECT_UNAUTHORIZED=0`. CI tests these rejection cases. Private production is still NOT DEPLOYED.

## 2026-10-15 — private disaster-recovery gate

The separate Private Knowledge Security CI now verifies a full disposable
PostgreSQL archive restore, including RLS and tenant authorization state.
Evidence: GitHub Actions run 38801324564. The synthetic archive is deleted
after CI and never uploaded. See `docs/PRIVATE-RECOVERY.md`.
No production backup service, offsite storage or retention schedule is configured.
Do not deploy the private backend before the authorized independent database
and its protected recovery plan are genuinely operational.

## 2026-10-15 — migration 005, private request quotas

Apply migrations **001 → 002 → 003 → 004 → 005** in a dedicated approved
confidential PostgreSQL instance, using the migration owner. Grant the
non-owner app role SELECT/INSERT/UPDATE only on
`knowledge_private.request_windows`; never DELETE or BYPASSRLS.
The startup preflight now requires **six** FORCE RLS tables and appropriate
quota-table grants. `private-knowledge/src/rate-limit.cjs` enforces read=120,
write=30, delete=20 and export=30 requests per workspace/minute. When
the limit is exhausted, the API returns HTTP 429 and rolls back its transaction.
Quota buckets are not automatically purged; a privileged retention plan is
required before live activation. The network gateway should rate-limit
unauthenticated traffic separately. Evidence: private CI 38802621695.
**The private service remains undeployed; Vercel hosts only public content.**

## 2026-10-15 — manual retention, not scheduled

See `docs/PRIVATE-RETENTION.md` and
`private-knowledge/maintenance/retention.sql`.
The script previews old operational-row counts without writing by default.
An authorized operator may execute bounded cleanup only with both
`apply=true` and `approved=true`; privileges and legal approval remain
external prerequisites. Synthetic PostgreSQL regression CI passed
(`38839681826`). No production cleanup task or backup-retention schedule
was enabled. Audit and customer documents are not in cleanup scope.

## 2026-10-15 — private migration 006 approval gate

Apply migrations **001 → 002 → 003 → 004 → 005 → 006** as an approved
migration owner on the independent private database only. The regular
KnowledgeAI runtime role requires SELECT, but never write privileges, on
`knowledge_private.source_approvals`. Startup preflight requires its seventh
FORCE RLS table, safe grants and a protected TLS connection. A trusted
TAKATAK operator must separately manage source approval, expiry and
confidentiality classifications, never via an unauthenticated client form.
Verify synthetic tests in CI, then real staging denial cases and restore.
See `docs/PRIVATE-SOURCE-APPROVALS.md`. No live private deployment has occurred.
