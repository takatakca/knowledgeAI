# ON2GO Hub (formerly TAKATAK Food Hub)

## Purpose

The merchant platform behind the owner's ~18 restaurant brands (two kitchens: NDG and Saint-Léonard), offered next to other restaurants and, later, retail stores. It is the same product as TAKATAK Food Hub. Only the merchant-facing name changes.

Repository: `takatakca/foodhubca`. Full blueprint (French): `docs/ON2GO_HUB_ECOSYSTEM.md` in that repository.

## What it does

- One console for every delivery platform and every brand: orders, one shared menu, 86 everywhere, hours, pauses, money (reconciliation, payouts, disputes), Watchtower alerts, reports and Copilot.
- One kitchen screen for every channel. Clover sits at the centre: no order is accepted that Clover did not receive.
- Direct channels come first:
  - the Clover order link everywhere
  - the brand sites
  - the customer app (a PWA first)
  - AI phone ordering, where one number can serve the brands of several kitchens
- Delivery for our own orders: DoorDash Drive, Uber Direct and our own couriers (a third fleet with a courier page).

## Ecosystem links (contracts, never a shared database)

- **ON2GO.ca** reads the public directory feed (`GET /api/public/directory`).
- **QMAPS** imports places and QR links from ON2GO.ca.
- **Brand sites and the customer app** send orders through the website-order contract, or through Clover Online Ordering.
- **TAKATAK Dashboard V1** (`takatak-v1`) is the control plane:
  - merchant accounts (tenants), plans, Stripe billing and entitlements
  - launch handoff (SSO)
  - usage events and analytics aggregates, with no personal data
- **Data residency:** order and customer data stay in Montréal (ca-central-1). TAKATAK stays in eu-west-1.
- **Platforms:** official APIs only. Each platform hears only about itself.

## Multi-tenant direction

1. One silo per merchant first: the same Docker image, its own Coolify app and its own database, provisioned from TAKATAK.
2. Then a pooled `tenant_id` on every `fh_*` table, scoped server-side, with RLS as the second defence.
3. A billing problem never blocks an order.

## Naming

- Merchant product: **ON2GO Hub**, set by `FOODHUB_PRODUCT_NAME`, which defaults to "Food Hub" until the owner flips it.
- Consumer brand: **ON2GO**.
- `foodhub.on2go.ca` stays the address platforms call for webhooks.
- The Clover App Market listing keeps "TAKATAK Food Hub" until Clover reviews a new listing.

## Roadmap (phases with acceptance checks in the blueprint)

- **H0 foundations:** multi-kitchen AI phone, product name, own couriers, tenant id.
- **H1:** direct channels live.
- **H2:** own courier operations.
- **H3:** marketing parity (promotions, loyalty, review replies, featured slots).
- **H4:** multi-merchant and billing.
- **H5:** retail.
- **H6:** native apps.

## Status rule

Status lives in the repository (`WORKLOG.md`, pull requests), not here. Do not record secrets, phone numbers or account identifiers in this public file.
