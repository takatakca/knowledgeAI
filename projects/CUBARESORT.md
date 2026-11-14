# CUBARESORT.CA — Source Recovery and TAKATAK Integration Handoff

**Date:** 2026-10-10  
**Scope:** CubaResort.ca, independent Cuba tourism/resort website and lead/booking inquiry platform  
**Status:** **BLOCKED — source repository not identified**, integration **PLANNED**, deployment **NOT VERIFIED**  
**Ecosystem master:** `takatakca/takatak-v1` (**read-only for this task**)

## Evidence and discovery (do not turn assumptions into facts)

- The linked `takatakca` GitHub account exposed **34 repositories** in the 2026-10-10 inventory; none was named or mapped to `cubaresort`. Repository-name searches returned no CubaResort repository.
- The existing `knowledgeAI/registry/portfolio-registry-2026-10-06.json` entry for `cubaresort.ca` has `"repository": null` and `"currentStatus": "UNKNOWN_NEEDS_AUDIT"`. **Keep this value until the real source repository is verified.**
- GitHub code search matched CubaResort contact references in unrelated `isexy` files, a legacy `takatak` visual reference, and `knowledgeAI` inventory records. **These are not proof that any of those repositories owns the CubaResort website.**
- The public website https://cubaresort.ca was reachable at audit time. Its observed customer paths include a price-match request, Cuba resort/forfait listings, competition, about, and contact pages. This is public behavior, **not source-code or backend verification**.
- A prior operational conversation described a **MochaHost/cPanel Node application** deployed from **Next.js standalone build artifacts**. Treat that as a historical recovery lead, not proof of the present host, original source-tree, branch, or production runtime. Keep server paths, account details, and credentials outside this public knowledge repository.
- `takatak-v1` contains `src/app/api/v1/` directories for auth, events, identity, and integrations, but **no CubaResort-specific API contract or permissions were verified during this discovery**. Directory presence is not evidence of an operational integration.

## Current business behavior to preserve

CubaResort specializes in trips to Cuba. The existing public site emphasizes a **price-match / additional 5% offer**, resort packages, inquiry forms, and direct contact. Preserve the current live site and its independent brand until working source and a validated rollback are available. Prior project content standards require hotel pages/posts with a bold hotel name and consistent sections for title, hotel, telephone/contact, travel agent, highlights, and why book with CubaResort.ca.

**Content/compliance audit before release:** The current site publicly advertises named resort prices, a price-match guarantee, licensing/TICO, client counts, testimonials, and turnaround promises. Obtain owner/operator evidence and the appropriate travel-law review before changing or repeating these commercial/regulatory claims; never infer that a claim is verified from public page text.

## Approved target boundaries

1. `CUBARESORT.CA` is an independent deployable application; no changes to `takatak-v1` public website, navigation, dashboard, authentication, secrets, or production.
2. TAKATAK alone owns master identity mapping. CubaResort independently enforces product membership, roles, entitlements and business/customer isolation server-side.
3. CubaResort retains its own travel offer data and customer inquiries. Only expressly authorized minimal CRM/lead or attribution events should traverse versioned, documented TAKATAK APIs.
4. No sharing database credentials, no cross-business customer records, no frontend master secrets, and no fabricated booking or payment API.
5. Booking must use a verified authorized travel supplier or licensed seller arrangement; an inquiry is **not** a confirmed booking.
6. Any new master API feature needs a separate proposed PR in `takatak-v1` and explicit approval before merge/deploy.

## Dependency-gated implementation order

1. **Recover actual source.** Locate the active deployment in hosting configuration (cPanel Setup Node.js App / Application Manager and File Manager), determine app root, runtime, deploy origin, package/build metadata, and original repository or local backup. Do not treat `.next/standalone` as the editable source repository.
2. **Establish a repository mapping.** Reuse the verified existing original repo; only bootstrap a new dedicated repository if the original is demonstrably unavailable and recovery ownership is established. Update the portfolio registry with documentary evidence.
3. **Inspect previous work.** Read `AGENTS.md`, `WORKLOG.md`, architecture, `package.json`, GitHub Actions, branches, PRs, issues, and migrations. Avoid collisions with other agents.
4. **Preserve and test.** Capture a rollbackable production snapshot, reconstruct a nonproduction environment, and test existing public routes, forms, uploads, language/SEO behavior, and mobile presentation.
5. **Integration contracts.** Inspect actual `takatak-v1` master API routes and authorization scopes. Implement the minimal signed, tenant-scoped event/lead adapter only for **verified** endpoints. Define idempotency, retries, consent handling, replay protection, health, and audit records.
6. **Travel UX and backend.** Improve resort discovery, detailed hotel pages, price-match workflow, lead case tracking, translation, secure customer contact, and authorized booking/referral handoff; preserve commercial copy unless approved.
7. **Release gates.** Test CI/typecheck/build, security and tenant isolation, end-to-end price-match submission and attachments, mobile/accessibility, staging, backups and rollback; review a dedicated PR, then deploy via the verified existing pipeline subject to production gates.

## Evidence/status table

| Area | Status | Evidence / blocker |
| --- | --- | --- |
| Public website | OBSERVED PUBLICLY | Homepage and price-match page available; backend not verified |
| Source repo | **BLOCKED** | No mapped `takatakca` repo; registry records `null` |
| Build/test | **BLOCKED** | Original source and pipeline unavailable |
| TAKATAK integration | **PLANNED** | Only master API directory discovery; no CubaResort contract confirmed |
| Production deploy | **NOT VERIFIED** | No active deployment job, source snapshot or authenticated host verification |
| Master TAKATAK website | **UNCHANGED** | Protected by separation rule |

## Next-agent handoff

Do not claim this documentation PR modifies or deploys CubaResort.ca. Next agent must **first retrieve the original CubaResort source tree / authenticated deployment configuration**. Once identified, develop in the real product repository, create an isolated feature branch and PR, update its own agent handoff, and leave `takatak-v1` unmodified without separate authorization.

**Useful links:** [live site](https://cubaresort.ca) · [portfolio registry](https://github.com/takatakca/knowledgeAI/blob/main/registry/portfolio-registry-2026-10-06.json) · [master code](https://github.com/takatakca/takatak-v1).
