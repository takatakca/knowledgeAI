# TAKATAK Ecosystem — Developer Backlog

- **Started:** 2026-10-06
- **Maintained by:** the Claude Code session building the ecosystem integration. Items are added as work uncovers them.
- **Companion map:** [`10-ECOSYSTEM-INTEGRATION-MAP.md`](./10-ECOSYSTEM-INTEGRATION-MAP.md)

**Legend**

| Column | Values |
| --- | --- |
| **P** (priority) | P0 = blocks going live / losing money or data now · P1 = needed for a complete product · P2 = improvement |
| **Who** | **Owner** = needs owner accounts, secrets or decisions · **Dev** = developer task · **Built** = code already written on a branch; dev reviews, merges and activates |
| **Status** | `open` · `built-on-branch` · `done` |

This repository is public. Security items are described without exploitable detail; the owner has the specifics.

---

## A. Go-live of work already built (review → merge → configure)

| ID | P | Who | Repo | Item | Done when |
|---|---|---|---|---|---|
| TK-001 | P0 | Built | takatak-v1 | Merge `claude/website-lead-capture`. Domain, "Post a project" and marketplace checkout requests become Leads in `/dashboard/leads` (includes TK-010, TK-011, TK-012, TK-017, TK-062, TK-066; migration `20261006150000`) | merged, migration deployed, `WEBSITE_LEADS_ENABLED=true`, `WEBSITE_LEADS_CLIENT_ID=<TAKATAK agency workspace UUID>` set on the server in the same deploy; optional `WEBSITE_LEADS_NOTIFY_EMAIL=<internal team address>`; for file uploads create a **private** Supabase bucket `website-lead-attachments` and set `WEBSITE_LEADS_UPLOAD_SECRET` (32+ random chars) |
| TK-002 | P1 | Built | takatak-v1 | Merge `claude/qmaps-listings-reviews-sync` (QMAPS → Local Listings & Reviews receiver + migration `20261006120000`) | merged, migration deployed, `QMAPS_SYNC_*` set |
| TK-003 | P1 | Built | qmaps | Merge `claude/takatak-listings-reviews-sync` (outbox, triggers, `takatak-sync-outbox` function) | migration applied, function deployed with `TAKATAK_QMAPS_SYNC_*` + `TAKATAK_SYNC_RUNNER_SECRET`, scheduled every minute, `takatak_sync_settings.enabled=true` |
| TK-004 | P1 | Owner | takatak-v1 | Link each QMAPS business to its client workspace | `npm run qmaps:link -- --client <uuid> --business <uuid>` done per business; then `SELECT public.takatak_backfill();` in QMAPS |
| TK-005 | P1 | Built | takatak-v1 | Merge `claude/seo-site-audit` (`/dashboard/seo`, migration `20261006140000`) | merged, migration deployed, an audit runs from the dashboard |
| TK-006 | P1 | Built | takatak-v1 | Merge `claude/facturations-billing-integration` (read-only invoice drafts) | merged; stays off until TK-030 |
| TK-007 | P1 | Dev | takatak-v1 | Resolve merge overlaps between the five V1 branches | merged cleanly. Each branch adds lines after the same anchors in `package.json` scripts, `.github/workflows/ci.yml`, `.env.example`, and (two of them) `scripts/reconcile-*-migrations.mjs`. Keep all lines; keep migrations in timestamp order (`20261006120000` QMAPS, `20261006140000` SEO, `20261006150000` lead attachments) |
| TK-008 | P1 | Dev | qmaps | Run the `takatak-sync-outbox` Deno function once on staging (it was verified only through an equivalent Node sender) | one real delivery returns `PROCESSED` |
| TK-060 | P0 | Built | takatak-v1 | Merge `claude/website-seo-https` (HTTPS redirect, canonical URLs, og:image, JSON-LD, titles; includes TK-015, TK-016) | merged; `http://takatak.ca` returns 308 to `https://`; re-audit from `/dashboard/seo` |
| TK-061 | P2 | Built | takatak-v1 | Merge `claude/repo-hygiene` (removes 9 stray backup files; includes TK-018) | merged |
| TK-009 | P2 | Built | knowledgeAI | Merge `claude/ecosystem-integration-map` (this backlog + the map) | merged to `main` |

## B. Live website (takatak.ca) problems found

| ID | P | Who | Repo | Item | Done when |
|---|---|---|---|---|---|
| TK-010 | P0 | Built (`claude/website-lead-capture`) | takatak-v1 | **Marketplace checkout loses orders.** "Continue in dashboard" goes to `/dashboard/marketplace` (no such page); the order is never recorded | checkout creates a Lead/order in V1 and shows a confirmation with a reference. **Built:** orders priced server-side from the catalog (browser totals ignored), stored as high-priority leads, "Order received" + reference; no payment taken |
| TK-011 | P0 | Built (`claude/website-lead-capture`) | takatak-v1 | Dead links to `/dashboard/marketplace`: `SiteFooter.tsx`, `checkout-client.tsx`, `lib/website/public-services.ts` (post-project fixed in TK-001) | no link to a missing page |
| TK-012 | P1 | Built (`claude/website-lead-capture`) | takatak-v1 | "Post a project" file uploads (`FileUploadPanel`) are kept in the browser only, never uploaded | **Built:** private bucket, signed per-lead upload token, byte-level type check, 5 × 10 MB, `lead_attachments` table, staff download via 1-minute signed link from the new lead detail page `/dashboard/leads/<id>` |
| TK-065 | P2 | Dev | takatak-v1 | Lead attachments are not virus-scanned (stored `quarantined`, download-only) | scan on upload (e.g. ClamAV or a storage-provider scan); status becomes `approved` or `rejected` |
| TK-066 | P1 | Built (`claude/website-lead-capture`) | takatak-v1 | Lead detail page is read-only: no status change, assignment, notes or follow-up date | **Built:** status, priority, follow-up date and notes with history + audit (`edit_content`). **Still open:** assigning a lead to a team member |
| TK-013 | P1 | Dev | takatak-v1 | `src/lib/website/api-client.ts` is a stub; promo codes (`lib/website/promotions.ts`) are not server-backed | promotions validated server-side, or the promo UI is hidden |
| TK-014 | P2 | Dev | takatak-v1 | Website prices hard-coded (`lib/website/pricing.ts`, `marketplace-packages.ts`) although `ProductCatalog`/`ProductPrice` exist | prices read from the catalog with the current values as fallback, plus an admin way to edit them |
| TK-015 | P0 | Built (`claude/website-seo-https`) | takatak-v1 / hosting | **`http://takatak.ca` does not redirect to `https://`** (HTTP 200 on port 80) | 308 to `https://` for every path. **Built** in the app proxy (only when the host's `x-forwarded-proto` says `http`) |
| TK-016 | P1 | Built (`claude/website-seo-https`) | takatak-v1 | SEO audit of takatak.ca (79/100): homepage title 76 chars; no canonical on 9 pages; **no `og:image`** (other Open Graph tags exist); no JSON-LD; titles with doubled "— TAKATAK" | re-audit ≥ 95 after deploy |
| TK-017 | P1 | Built (`claude/website-lead-capture`) | takatak-v1 | Lead notification: nobody is alerted when a website lead arrives | **Built:** in-app notification per new lead (no contact details), real `/dashboard/notifications` page with mark-read, optional internal email (`WEBSITE_LEADS_NOTIFY_EMAIL`). SMS not built |
| TK-019 | P1 | Owner | takatak-v1 | Marketplace copy promises "escrowed payments", but no payment or escrow exists (checkout records an order; nothing is charged) | wording changed, or escrow built |
| TK-018 | P2 | Built (`claude/repo-hygiene`) | takatak-v1 | Remove stray `*.before-lint-fix` backup files (9 under `src/`) | removed + ignored. The `fallback.hosting.*` keys are **kept**: they belong to TK-062 |
| TK-062 | P1 | Built (`claude/website-lead-capture`) | takatak-v1 | Hosting has no fallback request form when the Upmind widget is unavailable (translations `fallback.hosting.*` exist in EN/FR, no component uses them); the domain page has one | **Built:** after 10 s without Upmind, `/checkout` shows a hosting request form → `hosting_request` lead + notification; browser-tested |
| TK-064 | P1 | Dev | takatak-v1 | On phones, the "New client offer / 10% off" popup covers about half the screen over page content and forms (seen while testing `/checkout`). The email it collects goes to the promotions stub (TK-013) | popup is dismissible, does not cover forms on small screens, and stores the email server-side or is removed |
| TK-063 | P2 | Dev | takatak-v1 | Unread count badge on the sidebar "Notifications" link | badge shows unread count for the workspace |

## C. Agency stack (Layer A) still to build

| ID | P | Who | Repo | Item | Done when |
|---|---|---|---|---|---|
| TK-020 | P1 | Owner | takatak-v1 | Confirm Upmind credentials on the production server (domains/hosting sync code exists and runs on page view) | `/dashboard/web-hosting/domains` shows real client domains |
| TK-021 | P1 | Owner+Dev | takatak-v1 | SEO keywords and backlinks: Google Search Console OAuth (owner creates the Google Cloud OAuth app) | `/dashboard/seo/keywords` shows real queries, clicks and positions |
| TK-022 | P2 | Dev | takatak-v1 | SEO: scheduled weekly re-audits, score history, white-label PDF report | done |
| TK-023 | P1 | Dev | takatak-v1 | AI Studio: no live generation yet | provider connected with approval-before-publish |
| TK-024 | P1 | Dev | takatak-v1 | Reviews: reply to reviews from TAKATAK (QMAPS-side API needed); Google Business reviews | replies flow back to the source |
| TK-025 | P2 | Dev | takatak-v1 | Admin UI to link QMAPS businesses to workspaces (today a CLI script) | link/unlink from `/dashboard/admin` |
| TK-026 | P2 | Dev | takatak-v1 | Reports: export/delivery not active | PDF export + scheduled delivery |
| TK-027 | P1 | Dev | takatak-v1 / Facturations | An accepted checkout order (lead) should become a Facturations **draft** invoice awaiting owner approval | "Create draft invoice" action on an order lead |
| TK-028 | P2 | Owner | takatak-v1 | `brand.ts` has no street address or phone, so the site cannot publish `LocalBusiness` structured data or match a Google Business profile | address/phone provided, added to `brand.ts` and JSON-LD |

## D. Billing (Facturations)

| ID | P | Who | Repo | Item | Done when |
|---|---|---|---|---|---|
| TK-030 | P1 | Owner | Facturations | Isolated staging on MochaHost: HTTPS, dedicated PostgreSQL, least-privilege DB role, backup/restore proof | staging go/no-go passes (`npm run go-no-go:staging`) |
| TK-031 | P1 | Owner+Dev | Facturations | One deployment serves one business (`WAVE_BUSINESS_ID`). Decide multi-business support vs one deployment per business | decision recorded and implemented |
| TK-032 | P1 | Dev | Facturations | Remaining items in Facturations README "Non livrés ou non vérifiés" (real Wave, email provider, payments, tax review, …) | per that list |
| TK-033 | P2 | Dev | Facturations | 20 open AI/integration PRs (#122–#147) await review; several use OpenAI and need explicit owner approval per `AGENTS.md` | reviewed, merged or closed |

## E. Ecosystem integration

| ID | P | Who | Repo | Item | Done when |
|---|---|---|---|---|---|
| TK-040 | P1 | Owner | 1lv / rentauto | 1LV and Rentauto → V1 event contracts exist on both sides; delivery needs secrets on both servers | events arriving in V1 (`source_synchronization_events`) |
| TK-041 | P2 | Dev | qmaps, flexsca, cubafoodca, deli-aden-online | Onboard remaining child apps through the same signed-event contract (see map §6) | each sends its domain events to V1 |
| TK-042 | P2 | Dev | takatak-automate | Port useful pieces (marketplace orders, promotions, automation jobs) into V1, then archive the repo | archived |
| TK-043 | P2 | Owner | takatak, takatakbackend | Retire the legacy takatak.ca site + MongoDB auth backend (second identity system; backend appears offline) | archived; no traffic |
| TK-044 | P1 | Owner | knowledgeAI | Import the ChatGPT conversation history / master plan (not found in any public repo) through the private-ingestion path | sources indexed with provenance |

## F. Security & hygiene

| ID | P | Who | Repo | Item | Done when |
|---|---|---|---|---|---|
| TK-050 | P0 | Owner | takatakbackend | **Credential material is committed in a public legacy repository.** Owner has the details | material removed, any affected key rotated, repo private or archived |
| TK-051 | P1 | Owner | takatak-v1 | `main` deploys to takatak.ca but is not branch-protected (owner deferred this on 2026-10-06 while uploads are ongoing) | PR + CI required on `main` |
| TK-052 | P1 | Dev | qmaps | `bun run lint` fails on `main` (pre-existing `no-explicit-any` errors in `src/components/...`), so CI is red | lint green |
| TK-054 | P2 | Dev | takatak-v1 | Add HSTS (`Strict-Transport-Security`) once every takatak.ca subdomain serves HTTPS (after TK-060 is live) | header present |
| TK-053 | P2 | Dev | takatak-v1 | Lint warning: unused `CheckCircle2` in `src/components/rentauto/rentauto-host-verifications-card.tsx` | clean |

---

## Changelog

- **2026-10-06:** backlog created. Built on branches: TK-001, 002, 003, 005, 006, 009.
- **2026-10-06:** TK-010, TK-011 built on `claude/website-lead-capture` (checkout orders recorded as leads, priced server-side; dead links removed; 15 checks). TK-015, TK-016 built on new branch `claude/website-seo-https` (TK-060; 9 checks). TK-016 corrected: only `og:image` was missing. Added TK-019, 027, 028, 054.
- **2026-10-06:** TK-017 built (lead notifications, notifications page, opt-in internal email; 18 checks; verified on real PostgreSQL incl. cross-workspace isolation). TK-018 built on `claude/repo-hygiene` (TK-061). Added TK-062, 063.
- **2026-10-06:** TK-062 built (hosting request form; 20 checks; Playwright test with Upmind blocked). Added TK-064.
- **2026-10-06:** TK-012 built (private uploads + lead detail page; 24 checks; HTTP, real-PostgreSQL and browser tests). Added TK-065, 066.
- **2026-10-06:** TK-066 built (lead updates + history; `qa:lead-actions`, 5 checks; verified on real PostgreSQL).
