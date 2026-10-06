# Annual Portfolio Cleanup Plan — 2026

## Goal

Create one authoritative operational registry for every TAKATAK/client domain, repository, deployment, database, third-party account and contract boundary.

The 2026 cleanup starts from `docs/10-PORTFOLIO-DOMAINS-REPOS-2026-10-06.md`, but the final truth must come from live registrar, DNS, hosting, GitHub and deployment evidence.

## Cleanup sequence

### A. Domain/hosting reconciliation

Export the current domain/account list from MochaHost/cPanel and any other registrar/host.

For each domain:
- verify registration status and expiration;
- identify registrar;
- identify authoritative nameservers/DNS provider;
- identify current A/AAAA/CNAME/MX records;
- identify SSL state;
- identify hosting account/document root;
- identify whether WordPress, static, Node, redirect, parked or unused;
- identify client/business;
- identify canonical domain and redirects.

Do not delete or let a domain lapse solely because it is not mapped yet.

### B. GitHub reconciliation

For every repository:
- identify project/business;
- identify canonical domain;
- determine current/legacy/experimental status;
- determine default and production branch;
- inspect secrets exposure and committed `.env` files;
- identify CI/CD;
- identify deployment target;
- identify live database/storage;
- identify owner/maintainer;
- add a README where missing;
- add transferability metadata for client projects.

### C. Deployment reconciliation

Build a deployment registry:
- Contabo/Coolify
- MochaHost/cPanel/Passenger/WordPress
- Vercel
- Lovable-hosted preview/production
- Supabase Edge/runtime where relevant
- Cloudflare DNS/proxy
- other providers

Every production service gets:
- health check
- deployment source
- rollback path
- backup path
- last verified date

### D. Client contract boundary

For each client:
- platform/code transfer terms;
- contract start/end;
- hosting responsibility;
- domain ownership/management;
- data classes;
- first-party customer-data treatment;
- TAKATAK-originated lead treatment;
- third-party account ownership;
- offboarding package;
- payment/suspension rules;
- transfer readiness.

### E. Marketing/account reconciliation

Map:
- Meta Business / ad account
- Google Ads
- Search Console
- GA4
- Google Business Profile
- TikTok/YouTube/LinkedIn/etc.
- email sender domains
- Twilio numbers/messaging
- Stripe/Clover/delivery platform connections

to the correct project/client.

### F. Archive / retire

A project can be marked `RETIRED` only after:
- ownership/contract is known;
- source is backed up/tagged;
- data retention is handled;
- DNS/email impact is checked;
- replacement/redirect is documented;
- client approval is recorded where required.

## Required statuses

Use one of:

`ACTIVE_PRODUCTION`
`ACTIVE_MANAGED`
`STAGING`
`BUILDING`
`PLANNED`
`DORMANT`
`LEGACY`
`TRANSFER_PENDING`
`TRANSFER_READY`
`TRANSFERRED`
`RETIRED`
`UNKNOWN_NEEDS_AUDIT`

## Deliverables

The cleanup is complete when there is:
1. a domain registry,
2. a repository registry,
3. a deployment registry,
4. a client/contract map,
5. a data-rights/offboarding map,
6. a provider/account registry,
7. a list of duplicates/legacy assets,
8. a prioritized 90-day work plan.

Do not equate "not found in GitHub" with "not real." WordPress/cPanel sites and unpublished domains may exist without a dedicated repository.
