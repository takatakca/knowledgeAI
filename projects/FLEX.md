# FLEX'S / Flexible Service

## Product

Repository: `takatakca/flexsca`  
Known domain: `flexs.ca`

FLEX'S is a service-lead marketplace inspired by professional lead platforms such as Bark. Its repository describes a mobile-first professional experience with leads, responses, reminders, magic-link login and service-provider workflows.

## Strategic role

FLEX'S should be treated as its own transferable product. During a TAKATAK-managed contract it may consume TAKATAK lead, CRM, AI, messaging, billing or identity services through adapters.

Lead provenance is critical. A lead originating from the TAKATAK network must remain distinguishable from a lead generated directly by the FLEX'S platform/client.

## Cleanup needs

Verify current production deployment, business/client ownership, canonical auth architecture, live database, payment model, lead-source rules and transfer/offboarding scope.

## Verified state — 2026-11-13 (signed: Claude, Claude Code cloud session on `takatakca/flexsca`)

Source of truth for live state: [`00-FLEXS-START-HERE.md` on `main`](https://github.com/takatakca/flexsca/blob/main/00-FLEXS-START-HERE.md). Read it before any FLEXS work.

- **Canonical name:** FLEXS (older pages say FLEX'S).
- **Live database:** Supabase project **ALKAO** (`ysghtkallwuoodwqgkjm`, ca-central-1), shared with the ALKAO ticketing product by the owner's decision. FLEXS tables sit in `public` beside `ticketing_*`; the two products share one login table. The original Lovable project `vcaphsvudlseemkalawz` is abandoned (outside the owner's accounts).
- **Do not** run FLEXS migrations in a TAKATAK database: `profiles`, `leads` and `notifications` collide.
- **Canonical auth:** FLEXS uses its own Supabase Auth in ALKAO. No shared TAKATAK sign-in exists.
- **Payment model:** professionals buy credits with Stripe Checkout and spend them to unlock a customer's contact. Stripe secrets are not set yet.
- **Production deployment:** website not hosted (flexs.ca answers 403 from Apache). Target is Coolify from the repository `Dockerfile` (flexsca PR #6).
- **Mobile:** Capacitor 8 Android/iOS projects, app ID `ca.flexs.app` (flexsca PR #6). Not yet in any store.
- **TAKATAK-V1 link:** signed adapters exist on both sides (`takatak-v1` `/api/integrations/ads/flexs/events`; FLEXS `takatak-attribution-worker` and `takatak-opportunity-intake`). No secret is configured and no real event has been exchanged.
- **AI:** none in FLEXS yet; intended route is the TAKATAK AI Nexus adapter, not provider keys inside FLEXS.
