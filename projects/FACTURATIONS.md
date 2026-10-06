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
- From TAKATAK, the v1 integration can only read state and create drafts. Approval, issuance, delivery, publication and payment capabilities stay `false`.
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
