# Private KnowledgeAI Auth integration — VERIFIED discovery, not live

Date: **2026-10-14**. Source: public `takatakca/takatak-v1`, code revision `dcd454e42e95f08c407c53ab1af73ee2b36e0e4f`.

## Verified architecture evidence

- `src/lib/auth/otp/session.ts`: TAKATAK uses Supabase SSR sessions and OTP/magic-link flows server-side; session management is not a generic bearer-token issue endpoint for downstream apps.
- `src/lib/security/workspace-api.ts`: `requireWorkspaceApiPermission(permission)` derives access through `getServerAccessContext()` and `hasEffectivePermission()`; it distinguishes unauthenticated (401), missing workspace or permission (403), and unavailable DB/foundation demo (503). Only `client_scoped` access with permission is accepted.
- `src/lib/security/workspace-guard.ts`: server-side permission checks on the selected workspace; identity alone is not authorization.
- `src/app/.well-known/jwks.json/route.ts`: calls `getBlueskyPublicJwks()`. **It is for Bluesky OAuth, not a general TAKATAK identity issuer**. Do not use this endpoint to validate private KnowledgeAI access tokens.
- `src/lib/integrations/facturations/service-token.ts`: verified example of a short-lived, service-specific JWT with `iss`, `aud`, `sub`, `business_id`, `roles`, `iat`, `exp`, `jti`; uses HS256 with a dedicated integration secret and a lifetime capped at 90 seconds. **Do not reuse Facturations' secret, audience or role claims for KnowledgeAI**.

## Proposed next boundary (NOT YET IMPLEMENTED)

A TAKATAK-controlled server should:
1. authenticate a real Supabase session (or approved federation credential);
2. resolve workspace membership, active status, product entitlement and resource permission from authoritative server-side state;
3. issue a short-lived **KnowledgeAI-specific** service credential or call a private backend directly, with explicit issuer/audience, subject, workspace, product and least-privilege scope;
4. keep credentials and private source content off the browser, URLs, logs and this public GitHub repository;
5. maintain auditable tenant-scoped reads/writes and replay protection for ingestion jobs;
6. document private storage retention, deletion/transfer and reauthorization.

A KnowledgeAI backend must reject tokens unless their cryptographic signature, issuer, audience, expiry, explicit scopes and authoritative workspace/entitlements have been verified. Never accept editable browser metadata, client-supplied `workspace_id` alone, a public repository search result or a valid login as sufficient authorization.

## Required external prerequisites

- Explicit TAKATAK ↔ KnowledgeAI **private service contract** (how a real signed token is issued and validated), not merely a JWKS URL guessed from route names.
- Approved database with tenant isolation and secure connection, encryption/backup/retention controls.
- Approved classification of confidential source material and ingesting parties' permissions.
- Separate private deployment with logging/monitoring and tests for both correct access and cross-client denial.

Keep `/api/search` and `/api/health` PUBLIC and read-only. Do not expose a "private API" route until it has an actual authentication and storage implementation.
