# AHMV / AHM Verdun

## Product boundary

AHMV is an independent application/experience, not a feature automatically exposed inside the standard TAKATAK dashboard.

## Access

Access is controlled through server-side product entitlements. Direct AHMV URLs must also enforce entitlement checks.

Removing access should not destroy product data.

## Shared TAKATAK services

AHMV may consume shared services such as:
- identity/auth
- subscriptions
- entitlements
- billing
- notifications
- SMS/voice
- email
- social connections
- reviews
- CMS/blog
- analytics
- AI/automation
- webhooks
- connector vault

AHMV retains its own UX, permissions and domain data.

## Hockey data authority

Scoresheets/HockeyCMS remains authoritative for hockey schedule/results data unless an approved replacement is established.

Preferred integration:
- official read-only API, ICS or export when available
- provenance/freshness metadata
- fail-safe handling of stale sources
- no unnecessary personal-data ingestion

## Pricing

Plans and prices belong in a configurable Product Catalog, not hardcoded UI logic.
