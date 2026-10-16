# TAKATAK ↔ private KnowledgeAI: issuer integration contract

**Status: tested server-only cryptographic component, NOT wired into TAKATAK main, NOT deployed.**

## Reuse existing central authority

TAKATAK master (repository `takatakca/takatak-v1`) already has
`getServerAccessContext()` (`src/lib/security/access-context.ts`),
`hasEffectivePermission()` (`src/lib/security/effective-permissions.ts`),
and server-side membership resolution. Do NOT create another user directory
or trust a client-provided `workspace_id`, product grant or role.

The standalone pure Node component is
`private-knowledge/integrations/takatak-issuer.cjs`.
It returns an RS256 60-second `knowledgeai` JWT, and a separate public JWKS
representation. The unit tests verify signatures against the existing
`private-knowledge/src/auth.cjs` verifier and test key rotation.

## Required integration wiring inside TAKATAK

1. Read a REAL authenticated server session using `getServerAccessContext()`.
   Require `access.mode === 'client_scoped'`, an active authenticated membership,
   and the selected `activeClientId` belonging to `allowedClientIds`. Never
   issue from `foundation_demo`, `selection_required`, `platform_admin`, or
   any denied/inactive account.
2. Query TAKATAK's authoritative service/product entitlement for the selected
   client. **No KnowledgeAI-specific entitlement is currently confirmed**;
   fail closed until a product provisioning rule is explicitly defined and
   operational. Do not infer this from an unrelated `ai_studio` or `custom`
   service, or from a platform administrator role.
3. Map each requested scope (`knowledge:read`, `knowledge:write`,
   `knowledge:delete`, `knowledge:export`) to an explicitly APPROVED server-side
   permission/role policy, using `hasEffectivePermission()` where applicable.
   Do not treat generic `view_dashboard` as a KnowledgeAI grant and never
   accept an arbitrary requested scope from a browser without authorization.
4. From this same server-side request context, call `issueKnowledgeToken()`
   with `resolveAccess`, `authorizeProduct`, `authorizeScope`. The three
   callbacks MUST use trusted server-resolved data/database checks. Each
   issuance re-evaluates authorization; no cross-request user-level cache.
5. Provision a dedicated RSA 2048+ PEM signing key in a protected TAKATAK
   secret manager, with an explicit key ID (`kid`), HTTPS issuer origin,
   and a KnowledgeAI-only audience. Never commit secrets or write tokens
   to logs, HTML, localStorage, query strings or analytics.
6. Expose only `getKnowledgeJwks()` PUBLIC output at a dedicated, verified
   HTTPS JWKS endpoint; use a KnowledgeAI-only `kid` and keys, NOT
   TAKATAK's existing Bluesky OAuth JWKS. Rotate keys with overlapping
   public-key support at the issuer endpoint during token expiry windows.
7. Keep token exchange server-to-server through a protected gateway; the
   private KnowledgeAI service validates issuer, audience, signature,
   single operation scope and token lifetime, then independently checks its
   own workspace entitlement, revocations, RLS, quotas and source approvals.

## Secret/config contract — names only

- TAKATAK server: dedicated signing private key PEM (never browser-exposed),
  approved HTTPS issuer origin, audience and active key ID.
- KnowledgeAI private backend: `KNOWLEDGE_JWT_ISSUER`,
  `KNOWLEDGE_JWT_AUDIENCE`, `KNOWLEDGE_JWKS_URL`, `PRIVATE_DATABASE_URL`.
- Dedicated private PostgreSQL: migration owner and separate non-owner runtime
  login, verified TLS trust, encrypted offsite backups, approval-control
  operator and reconciled tenant entitlements.

## Verified test coverage and limitations

Run `node --test private-knowledge/tests/takatak-issuer.test.cjs`.
CI checks signature compatibility, exact claims, 60-second expiry,
fresh per-call authorization, denied workspaces, product/permission denials,
non-RSA/weak keys, tampering, public JWKS field secrecy and rotation.

Tests use an ephemeral locally generated RSA key and synthetic workspaces.
They do NOT demonstrate that a real TAKATAK user has KnowledgeAI access,
that TAKATAK has a configured signing key or endpoint, or that confidential
KnowledgeAI databases are running.

**Next:** define/provision the dedicated product entitlement in the TAKATAK
master authority, implement and validate its authenticated issuer/JWKS
routes there without changing the TAKATAK homepage, install the approved
signing key outside GitHub, verify two real staging memberships, and only
then connect to a separately provisioned confidential KnowledgeAI backend.

## 2026-10-16 — first proposed TAKATAK implementation

The draft master [PR #195](https://github.com/takatakca/takatak-v1/pull/195) now implements a master-side `issuer.ts` and an explicit `KnowledgeAIWorkspaceGrant` model (separate from `ai_studio`). The proposed `POST /api/integrations/knowledgeai/search` route requires a real session, current per-scope grant, same-origin request and bounded payload; it signs a short-lived token **only on TAKATAK server** and proxies to an independent confidential KnowledgeAI endpoint. `GET /api/integrations/knowledgeai/jwks` returns only the public signing parameters when enabled. CI, migration review, secrets and actual staging tests are still pending. This is a proposal, not a deployed issuer.
