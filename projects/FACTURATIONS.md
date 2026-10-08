# Facturations

## Role
Facturations (`takatakca/Facturations`) is the **single invoicing authority for the whole GROUPE TAKATAK ecosystem**. It is an independent, bilingual (FR/EN), mobile-first service. It runs on its own hosting with its own dedicated PostgreSQL database.

Every TAKATAK product feeds invoices through TAKATAK V1. Facturations owns the financial lifecycle:

draft → owner approval → issuance (Wave) → immutable PDF → delivery → payment evidence → client portal

## Architecture decision (2026-10-06)
TAKATAK V1 is the **billing gateway**, not a second invoicing system.

```
Ecosystem apps (Rentauto, AHMV, Ads, 1LV, FoodHub, …)
      ↓ enqueueInvoiceRequest()  (server code only)
TAKATAK V1 billing_invoice_requests queue  (platform OWNER reviews)
      ↓ signed 60-second HS256 service token + deterministic Idempotency-Key
Facturations /integration/v1/*  → DRAFT only
      ↓
Standalone Facturations OWNER workflow (approval, issuance, delivery, payment)
```

Rules:
- Facturations logic is **not ported** into TAKATAK V1, and the databases are **never shared**. This is required by Facturations AGENTS.md and README, and by the TAKATAK contract-only integration standard.
- The browser never holds the integration secret and never calls Facturations directly.
- TAKATAK platform `owner` acts as Facturations `OWNER`, and platform `admin` acts as `STAFF`. Roles are always derived server-side. The token `sub` is the MasterIdentity id (profile id as fallback), never an email.
- From TAKATAK, the v1 integration can only read state and create drafts. Approval, issuance, delivery and publication stay in Facturations (capabilities `false`). TAKATAK can also read an issued invoice's status by draft id (`/integration/v1/drafts/:id/issuance`, OWNER).
- Facturations labels dashboard values **DRAFTS ONLY**. Never present them as revenue, receivables or payments.

TAKATAK V1 implementation:
- Branch: `claude/takatak-billing-foundation` in `takatakca/takatak-v1`
- Guide: `docs/TAKATAK_BILLING_FACTURATIONS_FOUNDATION.md`
- Code:
  - `src/lib/integrations/facturations/`: env, token, client, contract
  - `src/lib/billing/invoices/`: draft validation, estimate, queue service
  - `/dashboard/admin/billing`: admin page
  - `/api/admin/billing/*`: admin API routes

## Money and tax rules (shared contract)
- Integer cents. CAD only for now.
- Line net = quantity × unitPriceCents − discountCents.
- Each tax is computed independently on the taxable subtotal and rounded half-up to the cent. No compounding.
- Tax rates are explicit milli-percent inputs (5000 = 5.000 %, 9975 = 9.975 %). **No jurisdictional rate is ever assumed.**
- Facturations always recalculates. The TAKATAK estimate is for display and audit only. It matches Facturations' calculator, verified on 2,000 randomized drafts.
- Official invoice numbers come from Wave at issuance. They are never assigned locally.

## Feeding rules for ecosystem apps
- One business event = one stable `(sourceApp, sourceReference)`. Re-feeding the same draft is a no-op.
- Corrections use a new reference. Stored requests are immutable, enforced by a database trigger.
- Retries are safe: the Idempotency-Key is derived from `(sourceApp, sourceReference)`, so Facturations returns the same draft instead of a duplicate.

## Reusable principles
- Financial evidence should favor append-only / immutable records where historical integrity matters.
- Corrections should be explicit adjustment/reversal records, never silent rewrites of past financial evidence.
- Ambiguous provider outcomes, such as timeouts, block automatic retries until reconciled. Unique external mappings prevent duplicate invoices.

## Status
- Facturations: in development, not deployed. No real invoices, Wave writes, emails or payments are authorized.
- Activation requires isolated Facturations staging: HTTPS, dedicated PostgreSQL, least-privilege role, backup/restore proof, and integration secrets configured outside GitHub.
- TAKATAK V1 integration: foundation built and tested end-to-end against a local Facturations instance. Disabled by default (`FACTURATIONS_INTEGRATION_ENABLED=0`). Its migration is not yet in the approved staging/production migration trains.

## Client dashboard and payments (2026-10-06)
- **One invoice per sale, from one issuer.** Stripe charges and invoices subscriptions (Social, Ads). Facturations issues custom invoices (Wave numbering). The client sees both on `/dashboard/invoices` ("Factures").
- **Paying a Facturations invoice.**
  1. TAKATAK opens a one-time CAD Stripe Checkout session for the Facturations **balance**, with metadata `facturations_business_id` and `facturations_issued_invoice_id`.
  2. Stripe sends the signed `checkout.session.completed` to **Facturations** (`POST /webhooks/stripe/payments`).
  3. Facturations verifies the signature itself and records `VERIFIED_PROVIDER_WEBHOOK` evidence (migration 046 enforces provenance in PostgreSQL).
- **Only verified payments count.** TAKATAK never marks an invoice paid. "Payée" appears only when Facturations reports `proofScope = VERIFIED_PROVIDER_PRESENT`. `SYNTHETIC_ONLY` is never real money.
- **PRs:**
  - takatak-v1: #107 gateway, #108 Stripe invoices, #109 Facturations invoices, #110 Payer;
  - Facturations: #158 browser login fix, #159 Coolify kit, #160 issuance status, #161 verified Stripe webhook.

## Clients billing their own customers (decision 2026-10-06)
- This runs on **Stripe Connect with the client's own Stripe account**, not on a multi-tenant Facturations. Each client is its own legal issuer: its own tax numbers, numbering, bank and liability.
  - The account has a Stripe-hosted dashboard. Stripe collects identity requirements and carries losses; the client pays Stripe fees.
  - Funds never pass through GROUPE TAKATAK.
- Facturations remains the invoicing authority **for GROUPE TAKATAK itself**.
- Tax rates are explicit client inputs. No jurisdiction is assumed.
- **PRs (takatak-v1):** #111 connect the account (table `client_stripe_connect_accounts`, immutable link), #112 create, send and list invoices. Off by default (`CLIENT_INVOICING_ENABLED`). Guide: `docs/CLIENT_INVOICING_STRIPE_CONNECT.md`.

## Status (2026-10-08)
**Merged:**
- takatak-v1 `main`:
  - #124 (2026-10-07) shipped the whole billing release in one merge: gateway, client invoice center, "Payer", Stripe Connect client invoicing, signed ecosystem feed. It replaces the separate PRs #107–#113.
  - #125 approved the three billing migrations for staging reconciliation.
  - #127 fixed the production artifact, whose validation now passes.
- Facturations `main`: #161, verified Stripe payments, refunds and disputes (migration 046).

**Waiting:**
- Facturations #158 (login fix), #159 (Coolify kit) and #160 (issuance status by draft) are green and up to date with `main`. Each needs one approval from `takatakmtl`; GitHub does not let the author approve.
- takatak-v1 staging: reconcile and deploy stop because the GitHub `staging` environment secret `TAKATAK_STAGING_DATABASE_URL` is empty.

**Do not merge `claude/facturations-billing-integration` (backlog TK-006).**
- It is superseded by #124: it rewrites the same `src/lib/integrations/facturations/*` files and `/dashboard/invoices`.
- It would show unissued drafts to clients, which breaks the rule that clients only see issued invoices.

**Migration timestamps:** the open branches `claude/qmaps-listings-reviews-sync`, `claude/seo-site-audit` and `claude/website-lead-capture` reuse the timestamps `20261006120000`, `…140000` and `…150000` of the billing migrations already on `main`. The folder names differ, so Prisma applies them all. Each still needs its own entry in `scripts/reconcile-staging-migrations.mjs`.

**Next:** client billing dashboard follow-ups.
- Summary figures.
- Remind / void / mark paid actions.
- Sidebar entry.
- TK-027: turn an accepted order lead into a Facturations draft. This needs `claude/website-lead-capture` merged first.
