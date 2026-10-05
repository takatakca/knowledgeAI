# Rentauto

## Repository / product
Known repository: `takatakca/rentautoca`
Deployment target: `rentauto.ca`.

## Application direction
- React
- Vite
- TypeScript
- SPA
- Supabase-backed services

Supabase responsibilities include PostgreSQL, Auth, RLS, Storage, Realtime and Edge Functions.

Product areas have included booking, Stripe/payment flows, GPS-related functionality, concierge and dashboards.

## Deployment pattern
GitHub Actions builds on Ubuntu, produces the release artifact and deploys to the hosting target using a versioned-release model.

Target concepts:
- release directories by commit
- `CURRENT`
- health check
- rollback on failure

## Build hygiene
Keep lockfiles synchronized with package manifests. CI should fail fast on dependency drift rather than allowing production to become the place where it is discovered.
