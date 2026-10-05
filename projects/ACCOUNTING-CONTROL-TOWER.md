# TAKATAK Accounting Control Tower

## Purpose

Central operational accounting/reconciliation workspace for restaurant and marketplace channels.

## Platform scope

Tracked systems include:
- UrbanPiper
- Clover
- DoorDash
- Uber Eats
- SkipTheDishes
- Too Good To Go
- internal ledger
- future accounting export such as QuickBooks

## Technical direction

- Next.js
- React
- Tailwind
- Supabase auth/cookies
- Prisma
- PostgreSQL
- pnpm

## Core concepts

- owner/admin/accountant/manager/staff/viewer/service-account roles
- platform/location mappings
- reconciliation
- payouts
- ledger review
- documents
- inventory/stock context
- reporting
- notifications
- live connector health

## Operational rule

Each location is expected to maintain the required delivery-service mappings. Missing, inactive or unmatched services should produce tasks rather than being silently ignored.

## Platform-state normalization

For marketplace status normalization, keep a small explicit state model instead of inventing ambiguous intermediate statuses.
