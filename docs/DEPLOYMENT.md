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
