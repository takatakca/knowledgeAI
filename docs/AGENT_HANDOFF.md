# Agent handoff — knowledgeAI

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
- NEXT EXACT ACTION: inspect real trusted TAKATAK service-token issuer contract with membership/entitlement resolution and identify separately approved private PostgreSQL project; generate/check package lock and test two tenant roles on that approved DB. Do not allow private ingestion before these checks.
