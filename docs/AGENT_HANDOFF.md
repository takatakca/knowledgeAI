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
