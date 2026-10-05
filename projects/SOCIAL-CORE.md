# TAKATAK Social Core

## Source precedence

Primary verified source snapshot:
- `social-core-current-state-2026-08-02.txt`
- verified state date: **2026-08-02**

When older social-context files conflict with that verified snapshot, the 2026-08-02 snapshot takes priority unless newer code/current production proves otherwise.

## Goal

Build a native TAKATAK social-media management platform. Metricool is only a feature/UX benchmark; TAKATAK must not depend on Metricool APIs, subscriptions, accounts, database, white-label infrastructure, scheduling or analytics infrastructure.

## Verified stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase cookie authentication
- Prisma 6.19.3
- PostgreSQL / Supabase
- pnpm
- tenant isolation by workspace, membership, brand and location

## Security and authorization patterns to preserve

- `getSessionUser`
- `requireWorkspacePermission`
- `requireWorkspaceApiPermission`
- `requirePlatformAdminApiAccess` where applicable
- active workspace-membership validation
- active brand-context validation
- audit logging
- same-origin JSON writes
- server-only Prisma access
- no provider-token logging
- no provider secrets returned to browser
- no authorization based on editable `user_metadata`
- database-level tenant constraints where possible

## Provider direction

Planned direct providers:
- Meta: Facebook, Instagram, Threads
- Google: Google Business Profile, YouTube
- LinkedIn
- TikTok
- Pinterest
- X
- Bluesky
- Twitch

Provider endpoints, scopes, account requirements and review requirements must be checked against current official provider documentation before implementation.

## Completed foundation packages

### Package 1 — Social database foundation

Known completed/validated foundation includes:
- permissions for social viewing/account management
- dashboard module access
- provider/status/OAuth-state enums
- `SocialProviderConnection`
- `SocialCredential`
- `SocialOAuthState`
- relations between social accounts, provider connections and business locations

### Package 2 — Token encryption and OAuth security

Known completed/validated security foundation:
- server-only AES-256-GCM token encryption
- versioned encryption keys
- encrypted token payloads
- encrypted PKCE verifier
- random OAuth state
- SHA-256 state hash storage
- timing-safe verification
- PKCE S256 challenge
- no token logging
- no public encryption variables

Existing encryption-key values must be preserved during migration. Rotation is a separate controlled project.

### Package 3 — Native social APIs

Known APIs:
- `GET /api/social/providers`
- `GET /api/social/connections`
- `POST /api/social/connections/start`
- `DELETE /api/social/connections/[connectionId]`

Known behavior:
- provider-readiness listing
- workspace-scoped connection listing
- brand filter validation
- permission-aware OAuth start
- honest unavailable/unimplemented response
- disconnect removes encrypted credential
- disconnect cancels pending OAuth state
- existing social accounts are retained but marked disconnected
- audit log records disconnect

### Package 4 — Social Accounts dashboard

The native Social Accounts dashboard was implemented and browser-tested in the verified 2026-08-02 snapshot.

## Verified provider state at that snapshot

All provider catalog entries were still:
- `implemented: false`
- `connectable: false`
- `state: planned`

No native provider connection should be called live unless a real provider call succeeds.

## Known cleanup

Metricool-era historical migrations/enums may remain and must not be destructively edited merely to remove the name from history.

Active runtime/seed cleanup was still required in the verified snapshot. Existing historical migration files must remain intact.

## Next-provider rule

Meta was identified as the next direct adapter in the verified snapshot, but current official Meta documentation must be consulted at implementation time.

## Definition of done

A major social feature is not complete just because it compiles. Completion should include:
- what it does
- files changed
- database changes
- permissions
- security boundaries
- API behavior
- manual browser tests
- automated tests
- failure tests
- tenant-isolation tests
- limitations
- final status
- current product comparison when relevant
