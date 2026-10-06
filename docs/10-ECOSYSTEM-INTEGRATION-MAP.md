# TAKATAK Ecosystem Integration Map

- **Reference date:** 2026-10-06
- **Method:** read-only inspection of the repositories listed below, the live public endpoints of `takatak.ca`, and the owner's instructions given on 2026-10-06.
- Re-verify against current code before relying on any status here (see the precedence rule in `00-MASTER-INDEX.md`).

## 1. Owner vision (2026-10-06)

GROUPE TAKATAK is an **agency control tower and data-collection centre**. TAKATAK controls the backend, clients, tickets and permissions. Partner businesses get full admin of their own space, while TAKATAK collects and consolidates the information and serves it back through every connected site and login (FLEXS, QMAPS, partner sites, associations).

Every client dashboard has two layers.

**Layer A: the standard TAKATAK agency stack.** It is identical for every client, website, referral and partner:

1. Domain names
2. Hosting
3. Social media
4. Local listings
5. SEO
6. Reviews dashboard (the closing piece)
7. AI Studio (editing posts, campaigns and analytics)

**Layer B: the personalized section.** It opens below Layer A for each client, organized by category or vertical, and reflects that client's own projects, campaigns and way of running the business. A Layer B dashboard can become an **independent application run on the client's side**, connected to the TAKATAK dashboard through an API integration.

## 2. What is live (verified 2026-10-06)

| Endpoint | Finding |
| --- | --- |
| `https://takatak.ca` and `www` | Served by **takatak-v1**. `/api/health` returns `"app":"TAKATAK User Official Dashboard V1"`. Hosted on Apache + Phusion Passenger (MochaHost pattern). Public website pages answer 200; `/dashboard/*` redirects to `/login`. Domain/hosting purchase widgets use Upmind (`embed.upmind.app`, `widgets.upmind.app`). |
| `https://takatak.onrender.com` (legacy `takatakbackend`) | No response within 100 s from the inspection environment. Treat as **offline / legacy** until proven otherwise. |

## 3. Repository roles

| Repository | Role | Generation |
| --- | --- | --- |
| `takatak-v1` | **Master control plane**: identity (`MasterIdentity`), workspaces (`Client`, `ClientMembership`), brands, locations, entitlements (`ProductCatalog`…), Layer A modules, Layer B vertical modules, and the public website (`src/app/(website)`). Next.js 16, Prisma, Supabase. | Current |
| `knowledgeAI` | Knowledge base and standards for agents (this repo). | Current |
| `Facturations` | Independent invoicing (drafts, approvals, Wave, PDFs, client portal). Own database. | Current |
| `takatak-automate` | Earlier public sales app (TanStack Start) + Render backend: orders, marketplace, automation jobs, promotions, service intents. V1 has already absorbed its public pages. | Previous |
| `takatak` + `takatakbackend` | Original takatak.ca site (Next 15) + Express/MongoDB auth/OTP/Upmind backend. A **second identity system**, which conflicts with the single-master-identity rule. | Legacy |

## 4. Layer A — module status in takatak-v1 (from `src/lib/dashboard/dashboard-config.ts` and code)

| Agency module | V1 route(s) | Engine | Status |
| --- | --- | --- | --- |
| Domains / Hosting / SSL | `/dashboard/web-hosting/*`, `/dashboard/hosting/*` | Upmind | Adapter + signed webhook exist; widgets live on website; dashboard sync not connected |
| Social media | `/dashboard/social/*` | Native TAKATAK Social (Meta first) | Foundation + OAuth security done; provider connections in progress (see `projects/SOCIAL-CORE.md`) |
| Local listings | `/dashboard/local-listings/*` | QMAPS | QMAPS sync built (branches), off by default |
| SEO | `/dashboard/seo`, `/seo/backlinks`, `/seo/keywords` | n/a | Planned placeholders |
| Reviews | `/dashboard/local-listings/reviews` | QMAPS / Google Business | QMAPS reviews sync built (branches), off by default; Google Business not connected |
| AI Studio | `/dashboard/ai-studio/*` | OpenAI (configured_untested), TryHolo (disabled) | No live generation |
| Ads | `/dashboard/advertising` | TAKATAK ADS | Foundation (see `projects/TAKATAK-ADS.md`) |
| Leads | `/dashboard/leads/*` | FLEXS | Not connected |
| Reports | `/dashboard/reports/*` | Internal | Foundation; no export/delivery |
| Invoices | `/dashboard/invoices` | Facturations | Read-only draft integration on branch `claude/facturations-billing-integration` (off by default) |

## 5. Layer B — vertical / partner integrations

Every vertical follows the same rule: **child app → TAKATAK V1 → authorized app**. There are never direct sibling calls, and there is one master identity.

| Vertical | Child repo | Direction | Mechanism | Status |
| --- | --- | --- | --- | --- |
| 1LV marketplace | `1lv-marketplace-hub` | 1LV → V1 | Durable outbox → `POST /api/v1/events` (Bearer `TAKATAK_1LV_API_KEY`, `Idempotency-Key` = event id) | Contract implemented both sides; delivery needs secrets |
| Rentauto | `rentautoca` | Rentauto → V1 | Supabase Edge outbox, HMAC `ts.eventId.body` → `/api/integrations/rentauto/events`; V1 module `/dashboard/rentauto` | Implemented both sides; gated by `RENTAUTO_SYNC_ENABLED` |
| R2NETTE | `r2neet` | R2NETTE → V1 | Signed events (`src/lib/integrations/r2nette`) | Receiver exists in V1 |
| AHMV hockey | `ahmverdunca` | Both | Control plane, schedule/team feeds, memberships (`/dashboard/hockey`) | Most advanced vertical |
| ALKAO ticket hub | `Alkao.ca` | ALKAO ← V1 control | Detachable ticketing engine; FESTI-ICE and Havana Resort as Clients/Brands | Phase A in progress |
| QMAPS | `qmaps` | QMAPS → V1 | Outbox + signed events (`/api/integrations/qmaps/events`) → linked client's Local Listings & Reviews | Built both sides on branches (`takatak-v1` `claude/qmaps-listings-reviews-sync`, `qmaps` `claude/takatak-listings-reviews-sync`); off by default; verified end-to-end |
| CubaFood, Deli Aden | `cubafoodca`, `deli-aden-online` | Future | Local TAKATAK auth helpers present | To verify |
| Facturations | `Facturations` | V1 → Facturations | Short-lived HS256 service token → `/integration/v1/*` | Read-only drafts on branch; staging gate pending |

## 6. Integration contract standard (use these, do not invent new ones)

1. **Child app → V1 events**
   - Use a durable outbox in the child app.
   - Each app gets its own credential; never reuse one app's key for another.
   - Use a signed body (HMAC `timestamp.eventId.rawBody`) or a per-app Bearer key.
   - Use event-id idempotency, and reject a reused id that arrives with a different payload.
   - Payload size cap, and a forbidden-field filter (no passwords, OTPs, tokens or card data).
   - Persist in `SourceSynchronizationEvent`.
2. **V1 → independent service**
   - A short-lived server-minted token carries the tenant (`business_id`) and role, both resolved from the TAKATAK session server-side.
   - Use fixed paths, strict response validation, and fail closed.
3. **V1 → client browser**
   - Server components or route handlers only.
   - No provider secret or service token ever reaches the browser.
4. **Activation**
   - Every integration is off by default (`*_ENABLED`).
   - "Connected" is shown only after a real credentialed call succeeds.

## 7. Known gaps (2026-10-06)

- **Website not wired** (forms partly fixed on `takatak-v1` branch `claude/website-lead-capture`: domain and project requests now become Leads in `/dashboard/leads`, off until `WEBSITE_LEADS_ENABLED=true`)
  - In `takatak-v1`, `src/lib/website/api-client.ts` throws `not_configured` for every call.
  - Website forms (signup, post-project, checkout) have no backend.
  - Pricing and packages are hard-coded (`src/lib/website/pricing.ts`, `marketplace-packages.ts`), although `ProductCatalog`/`ProductPrice` exist in the database.
- **Two identity systems**
  - The legacy Mongo auth in `takatakbackend` duplicates TAKATAK identity.
  - Retire it once nothing depends on it.
- **Facturations is single-business**
  - One deployment serves one business (`WAVE_BUSINESS_ID`).
  - Ecosystem-wide billing needs multi-business support or one deployment per business.
- **Branch protection**
  - `takatak-v1` `main` deploys to takatak.ca but is not protected (per the ALKAO audit of 2026-10-05).
  - Recommended rules: PR required, no force-push, no deletion.
- **Missing source material**
  - The owner's ChatGPT conversation history / master plan is not in any public TAKATAK repository.
  - It must be imported through the private-ingestion path (`backfill/PRIVATE-SOURCES-PENDING.md`) once this repository is private.

## 8. Build order (each step: feature branch → CI → staging → owner approval → main)

1. Protect `takatak-v1` `main`.
2. Website reads real data, keeping the current content as fallback:
   - prices from `ProductCatalog`
   - forms posting to V1 server routes
3. Layer A modules one by one, in the owner's order:
   - domains/hosting (Upmind sync)
   - social
   - local listings (QMAPS adapter)
   - SEO
   - reviews dashboard
   - AI Studio (with explicit approval before any publish or send)
4. Layer B: a generic "vertical module" pattern (entitlement-gated section plus a per-app signed contract), generalizing what Rentauto/AHMV already do. Onboard QMAPS, FLEXS, CubaFood and Deli Aden onto it.
5. Billing for every business: Facturations multi-business, then child apps submit billing requests that become **drafts awaiting owner approval** (never auto-issued).
6. Retire the legacy generation (`takatak`, `takatakbackend`) and archive `takatak-automate` once nothing depends on them.

## 9. Never automated without explicit owner approval

- issuing invoices, sending client emails, charging or refunding
- Wave or other provider writes
- publishing social posts
- deploying, merging to `main`, or enabling an integration flag in production
