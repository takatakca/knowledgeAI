# Agent handoff — knowledgeAI

## 2026-10-15 follow-up — TLS URL hardening

- Code commit `52a0968f7d0b6b5804da3b368c60c0c77adfd439` rejects PostgreSQL connection-string SSL overrides (including `sslmode=no-verify`) before the isolated private server starts; regression cases were added to `private-knowledge/tests/private.test.cjs`.
- Previously verified auth/preflight/real PostgreSQL suite: Private Knowledge Security CI `38793448231` SUCCESS, public catalog/production smoke `38793448260` SUCCESS; final follow-up CI and Vercel SHA must be refreshed after this documentation commit.
- Last source files changed: `private-knowledge/src/server.cjs`, `private-knowledge/tests/private.test.cjs`. Current milestone: security startup and authorization gates delivered in CODE only. Private KnowledgeAI remains UNDEPLOYED.
- Required next action: confirm TAKATAK authorized token issuer and administrative workspace lifecycle, provision an explicitly approved confidential PostgreSQL with verified TLS CA and least-privileged service role, test actual revocation and two-tenant staging paths, and separately deploy/monitor. No production secrets or billing projects were created.


## Latest agent checkpoint — 2026-10-15 (private authorization)

- Repository `takatakca/knowledgeAI`, `main`, PUBLIC. Starting main SHA `ece938126c12a42e7746be0a8638633e7e106c81`; newest source commits `c0df12a4` (workspace entitlements/revocation), `da87d047` (tests), `e8d097a1` (CI enrollment), `d0bc7ad0` (HTTP source pagination), `ad48d2c3` (private startup preflight), `30194cf0` (serialized tenant SQL checks). After this documentation commit and catalog automation, check HEAD anew.
- Completed: deny-by-default workspace entitlement and revoked-JTI authorization checked per transaction; startup preflight of FORCE RLS, non-owner/non-bypass runtime, restricted grants and TLS; HTTP inventory offset forwarding fixed.
- Files touched: `private-knowledge/src/{access,service,server,preflight}.cjs`, `private-knowledge/migrations/004_workspace_access.sql`, `private-knowledge/tests/{private,access,preflight,postgres.integration}.test.cjs`, `private-knowledge/tests/{access-controls,rls}.sql`, `.github/workflows/private-knowledge-tests.yml`, `WORKLOG.md`, all five `docs/` continuity files and `private-knowledge/README.md`.
- Verified source CI checkpoints: `38792797696`, `38792854564`, `38792985528`, `38793108805` were private CI SUCCESS; latest post-fix pipeline must be inspected after doc commit. GitHub Actions public CI and Vercel production changes are independent from the undeployed private service.
- Real deployment: PUBLIC KnowledgeAI catalog/search is on Vercel; PRIVATE service is **NOT DEPLOYED**, with NO real confidential project DB, signer, administrator provisioned or secrets imported. No existing Supabase projects were changed.
- Production blockers: TAKATAK-issued dedicated short-lived token mapped to authoritative active workspace/product entitlement; authorized administrative lifecycle for `workspace_entitlements` and `revoked_tokens`; approved private DB/roles/TLS; secure runtime and network, backups, recovery and retention, observability, two-tenant staging E2E validation.
- NEXT EXACT ACTION: identify/implement the verified TAKATAK signing/entitlement contract in the master repository after confirming owner approval; provision an **independent approved** private PostgreSQL instance; apply migrations 001–004 and grant restricted runtime, verify TLS/preflight and revocation against true staged identities; then deploy the private service separately with reversible release and health checks. Do not treat public Vercel as a private data plane.


## Verified final continuation — source inventory paging (2026-10-14)

- Latest task: make source inventory enumerable across pages; SQL `LIMIT/OFFSET`, no client-defined workspace; linked to the existing scoped version export `knowledge:export`, delete `knowledge:delete` and audit migrations 001→002→003.
- Source commits: `46bb0cf60b8455815be0c51f5050345613ea56b6` (pagination), `d305602f3a1cee7a1454790b0c7d61c4be388ee4` (fixture audit correction). The upcoming documentation commit and CI catalog bot commit change SHA; query GitHub HEAD on resumption.
- Updated files: `private-knowledge/src/{service,server}.cjs`, `private-knowledge/tests/{private.test.cjs,postgres.integration.test.cjs,lifecycle-audit.sql}`, `private-knowledge/README.md`, `docs/{PROJECT_STATUS,TASK_QUEUE,AGENT_HANDOFF,DEPLOYMENT,DECISIONS}.md`, `WORKLOG.md`.
- Last verified test: Private Knowledge Security CI `38630925562` SUCCESS: unit auth tests, real PostgreSQL 17 tenant pagination/search/ingest/delete/export, audit verification and dependency audit. Knowledge Catalog CI for preceding code change has succeeded; verify final docs commit CI and production Vercel SHA after catalog bot refresh.
- Production status: public Vercel portal ONLY; private server NOT deployed. No real workspace data, issuer signing service, database or private secret settings were provisioned. No changes to unrelated Supabase instances. Three unrelated PRs #3/#4/#5 preserved.
- True blockers: trusted KnowledgeAI token issuer with server-side verified TAKATAK membership/entitlement and revocation; separately approved private DB/runtime and credentials; backup/retention/offboarding, production gateway TLS and smoke checks. Do not activate private ingestion until these are confirmed.
- NEXT EXACT ACTION: verify/provision authorized TAKATAK issuer and dedicated DB, apply SQL migrations as owner, configure least-privileged runtime separately, run permission/denial/deletion/export and backup tests in staging, then approve private deployment. Continue independent runbook and observability work if those resources remain unavailable.


## Latest verified checkpoint — client version export (2026-10-14)

- Repository: `takatakca/knowledgeAI` PUBLIC, `main`. Beginning-of-checkpoint SHA: `a078f2a9841a018bf48f7a60bd2c4229823903ab` (later docs and catalog regeneration update SHA; inspect `main`).
- Last completed milestone: scoped inventory/delete with read and delete audit, and scoped paginated **version export** guarded by `knowledge:export`. Migration `003_export_audit.sql` extends operation audit constraints. All source bodies stay in the isolated private backend and are **never imported into the public Vercel API**.
- Modified this iteration: `private-knowledge/src/{service,server}.cjs`, `private-knowledge/migrations/{002_source_lifecycle,003_export_audit}.sql`, `private-knowledge/tests/{private.test.cjs,postgres.integration.test.cjs,rls.sql,lifecycle-audit.sql}`, `.github/workflows/private-knowledge-tests.yml`, `private-knowledge/README.md`, all five continuity documents, `WORKLOG.md`.
- Verified tests: private CI `38629828659` SUCCESS for inventory/deletion and private CI `38630318645` SUCCESS for export, full JWT/HTTP tests, PostgreSQL 17 restricted-role RLS, audit-owner checks, npm ci/locked dependencies and npm audit. Public CI validated preceding code changes; verify this documentation commit's own run.
- Deployment: Vercel public only; code SHA `4f4151ba305e12d068fc2a5534a9de92a27e38c1` previously READY. **No live private backend**, because authentic TAKATAK issuer/entitlements, dedicated private database, confidential service secrets and gateway are NOT configured or approved. No existing Supabase project was repurposed. Open PR #3/#4/#5 preserved.
- Blocking gaps: approval of issuer workspace/entitlement contract, dedicated private DB/runtime, revocation semantics, audit/receipt/backup retention, monitoring, client export approval, production TLS and two-workspace access checks.
- NEXT EXACT ACTION: in TAKATAK core verify or implement trusted short-lived KnowledgeAI issuer (never Bluesky JWKS); obtain explicit dedicated private PostgreSQL provisioning and authorize production rollout. Apply migrations 001→002→003 as migration owner, grant only necessary permissions to non-owner service role, configure secrets privately, verify two real test workspaces including delete/export denial and signed revocation, then deploy separately from Vercel. Do not ingest client data before these conditions.


## Most recent checkpoint — private source lifecycle (2026-10-14)

- Repository: takatakca/knowledgeAI, PUBLIC, branch main. At checkpoint start: `4f4151ba305e12d068fc2a5534a9de92a27e38c1`. **This documentation commit and catalog refresh will change HEAD; always read it again.**
- Completed task: private-knowledge GET `/v1/knowledge/sources` and DELETE `/v1/knowledge/sources?source_id=...`, scoped to signed JWT workspace; deletion requires knowledge:delete and consumes the one-time write-jti receipt. Audit for search/list/delete; migration 002 adds allowable audit operations and CI grants runtime DELETE only on tenant-scoped document rows.
- Files changed: `private-knowledge/src/{service,server}.cjs`, `private-knowledge/migrations/002_source_lifecycle.sql`, `private-knowledge/tests/{private.test.cjs,postgres.integration.test.cjs,rls.sql,lifecycle-audit.sql}`, `.github/workflows/private-knowledge-tests.yml`, `private-knowledge/README.md`, and the five continuity documents and `WORKLOG.md`.
- Verified tests: Private Knowledge Security CI `38629828659` all jobs SUCCESS: unit/security cases, real disposable PostgreSQL 17 multi-tenant tests, audit verification by privileged migration-owner rather than widening runtime role, lockfile check and npm audit. Public Knowledge Catalog CI on the corresponding code revision completed SUCCESS. Vercel public READY on code SHA `4f4151ba305e12d068fc2a5534a9de92a27e38c1`; final documentation SHA must be confirmed separately.
- Deployment status: **Public search live and tested in earlier HTTPS smoke checks. Private backend NOT DEPLOYED**. No dedicated approved PostgreSQL DB, TAKATAK KnowledgeAI issuer/audience/JWKS contract, or operational secret store attached. Supabase projects for unrelated apps were not modified.
- Known limitations: no tenant data export API, no audit/receipt/backup retention deletion policy, no production issuer revocation mechanism, no AI Studio VPS verification. Three open PRs #3/#4/#5 are unrelated and were not modified.
- NEXT EXACT ACTION: confirm approved TAKATAK issuer with server-side membership/entitlement verification; provision a dedicated confidential DB; install both migrations as owner; configure non-owner runtime plus proper gateway; verify live tenant denial/revocation and backup/retention before enabling private data. Independently implement a paginated, scoped source export and retention policy once legally approved.


## Latest verified checkpoint (2026-10-14)

- At beginning of this handoff update, GitHub main = cd45e9e8ee6369b3adbd65b546f3568caaf84271, public Knowledge Catalog CI run 38627614608 SUCCESS; Vercel production deploy for that SHA READY.
- Private Knowledge Security CI run 38627614637 SUCCESS: 9 JWT/transaction/HTTP tests, PostgreSQL RLS SQL tests, a full restricted-role PostgreSQL 17 ingestion/search integration test, reproducible npm ci, and npm high-severity audit. Synthetic data only.
- private-knowledge/package-lock.json added by bot SHA 76d142be0f98365930a3392a33f668abc39e3665; subsequent CI verified npm ci from committed lock.
- This documentation commit and subsequent catalog bot refresh change main SHA. Always inspect fresh head/CI/Vercel after this update.
- PUBLIC production remains only index.html, catalog and read-only public API. PRIVATE service code and migrations are tested, but not deployed and not wired to real TAKATAK issuer or separate approved confidential PostgreSQL.
- Pending human-authorized dependencies: trusted TAKATAK per-workspace service token issuer/entitlement verification, a dedicated private DB + login/provisioning, operational secrets/network/backup/retention, and production smoke tests.
- No live tenant records or credentials were copied to the public repo or another Supabase project. Open PRs #3, #4, #5 remain untouched.
- Next exact action: verify actual signed KnowledgeAI issuer and entitlement contract in TAKATAK core; provision the APPROVED separate private DB; run migration as owner and service as restricted login, check revocation, two live test workspaces and backups before activating private ingestion.


Last updated **2026-10-14** by GPT-6. Repository: `takatakca/knowledgeAI` (**PUBLIC**), branch: `main`.

## Last completed task

- Public browser knowledge search + auto-built deterministic catalog, 55 documents at previous checkpoint; the new five continuity files and this API document are also indexed.
- Read-only agent API `/api/search`, `/api/health`: bounded inputs, source ID and SHA-256 provenance.
- Python + Node tests in GitHub Actions and production HTTPS smoke workflow. Catalog auto-refresh now fetches latest `main` and retries non-force pushes to tolerate concurrent agent commits.
- Five mandated continuity documents and master index links.

## In progress / next

**Next task:** authenticated, tenant-scoped private ingestion and retrieval service. This is **not deployed or claimed as implemented**, because trusted TAKATAK OIDC settings, approved durable storage, confidential source approvals, and privileged runtime remain unverified.

## Commits, files and verification

- Starting checkpoint `0f285999211f668fc3d8dfc685d90e37ea28b4d1`.
- Last *verified* published head before this final handoff update: `ebbbcdfadb0c4019d12ec577d5fbf42f10812713` (bot regenerated the public catalog); the final handoff commit changes `HEAD`, so always query GitHub for the latest SHA.
- Agent-authored CI race fix: `9d47719b8c0ef83d94f08c338946c6a9fc1cc8d6`.
- Agent work commits: `e9f9e94e06dd83ad0557bab8988f7ff8c2b715ba`, `4ecba350da63bdec24b84f038eeac96b698d7949`, `0c3541bdbc962043a929c52fbaa1ab153887c512`, `4ca3ad226a56a3df0fb5fe88e090f723c5821ffe`.
- The final documentation commit that contains this handoff has a different SHA by definition; read `git rev-parse HEAD` / GitHub `main` and the catalog bot's subsequent commit. Do not treat a parent SHA as the current head.
- Modified/added: `api/search.js`, `api/health.js`, `tests/public-api.test.cjs`, `ingest/build_catalog.py`, `ingest/tests/test_catalog.py`, `ingest/README.md`, `assets/knowledge-search.js` (prior stage), `index.html` (prior stage), `.github/workflows/knowledge-catalog.yml`, `README.md`, `AGENTS.md`, `WORKLOG.md`, and the new/updated `docs/` continuity/API files.
- Checks: `python3 -m unittest discover -s ingest/tests -v` (5 passed); `node --test tests/public-api.test.cjs` (7 passed); catalog generation/check; Node syntax checks.
- Verified CI runs `38623184283` and latest `38623893521`: **success**, including the GitHub runner's live HTTPS GET of page, catalog, health and search.
- Vercel `knowledgeai` production SHA `ebbbcdfadb0c4019d12ec577d5fbf42f10812713`: **READY** at the latest verified checkpoint; the GitHub-runner live HTTP checks also passed. Re-verify subsequent handoff/catalog bot commits.

## Verified follow-up research — TAKATAK Auth

- In `takatakca/takatak-v1` revision `dcd454e42e95f08c407c53ab1af73ee2b36e0e4f`, server-side workspace API guard requires actual `client_scoped` access and permission; unauthorized requests yield 401/403/503.
- Auth uses Supabase session mechanisms. The `/.well-known/jwks.json` endpoint belongs to Bluesky OAuth and **must not be treated as the identity authority**.
- The existing Facturations service token is audience/secret-specific, not a reusable KnowledgeAI integration.
- See `docs/PRIVATE-AUTH-CONTRACT.md` for source-backed next implementation boundary.

## Known problems, access and open work

- Source repository is **PUBLIC**: never commit PII, legal material, secrets, private client data or payment info.
- Do not confuse this public search API with secured TAKATAK Auth or a cross-client CRM.
- No confirmed live AI Studio VPS install, real provider messages, paid credits or payment linkage. The kit is not a Vercel service.
- Open PRs #3 (ON2GO Hub), #4 (MIMT phase 2), #5 (CubaResort recovery): coordinate separately and avoid overwriting other agents.
- Secure runtime for private ingestion needs issuer/JWKS/audience and server-side entitlement mapping, approved DB, credentials kept outside GitHub, secrets vault and legal source permissions.

## Exact next action for the next agent

1. Read `AGENTS.md`, this file, `docs/TASK_QUEUE.md`, and `WORKLOG.md`.
2. Read GitHub `main` HEAD and newest CI/Vercel production SHA; verify live HTTP after catalog bot update.
3. Keep the public service working; do **not** pipe private content into it.
4. Inspect TAKATAK Auth's **actual** OIDC/JWKS and permissions contracts in the appropriate source repository; define a versioned private retrieval adapter with denial-by-default tenant/product scopes.
5. Implement private ingestion only against separately authorized infrastructure, with migration/authorization tests and secure deployment.

## Latest continuation — isolated private service (2026-10-14)

- Previous verified public head: 9f29bb37b2c606d0ef4a8a7837fbee080313da23, public CI run 38624116141 passed and Vercel READY.
- This session's commits include auth/schema e5d2e726667b6878c7b7caa112f7e30139582b18, HTTP/service d214f20a1b42a27717c6a96825db470693d38509, security tests 1b0df216a279d7f816c7ee94faa77921cb04f548, CI workflow db486e2cda51f07c9ae463cfb1f2ad1d0b5e1a80. The latest docs and catalog bot commit are later; inspect GitHub main HEAD to obtain exact deployed SHA.
- Last finished task: isolated private knowledge code, Node JWT/transaction tests and actual PostgreSQL 17 tenant-isolation migration tests (synthetic data only).
- Current task: private issuer and dedicated storage/prod rollout are blocked pending real TAKATAK authorization contract and approved private infra.
- Files changed: private-knowledge/package.json, private-knowledge/src/auth.cjs, src/service.cjs, src/server.cjs, migrations/001_private_knowledge.sql, tests/private.test.cjs, tests/rls.sql, private-knowledge/README.md, .github/workflows/private-knowledge-tests.yml, docs/PRIVATE-AUTH-CONTRACT.md, docs/DECISIONS.md, docs/PROJECT_STATUS.md, docs/TASK_QUEUE.md, docs/DEPLOYMENT.md, and WORKLOG.md.
- Checks: private CI workflow run 38626791522 both jobs success (JWT/Node and live ephemeral Postgres RLS). Public Knowledge Catalog CI continues separately. Exact command: node --test private-knowledge/tests/private.test.cjs; SQL: docker exec -i knowledge-private-ci psql -v ON_ERROR_STOP=1 -U postgres -d knowledgeci < private-knowledge/migrations/001_private_knowledge.sql, then same command for private-knowledge/tests/rls.sql.
- No new passwords or keys were committed. No private dataset or credentials were copied into Supabase staging or any unrelated client database. Public portal remains the only production deployment.
- NEXT EXACT ACTION: inspect real trusted TAKATAK service-token issuer contract with membership/entitlement resolution and identify separately approved private PostgreSQL project; package lock DONE; test role and authenticated issuer against a separately approved DB, with revocation/backup controls. Do not allow private ingestion before these checks.
