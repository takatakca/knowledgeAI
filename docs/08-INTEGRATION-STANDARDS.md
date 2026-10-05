# Integration Standards

## Official integration rule
Use official APIs, documented partner interfaces and authorized OAuth/account connections.

Do not present mock or placeholder integrations as live.

## Provider checklist
Before implementing a provider:
1. verify current official documentation,
2. confirm production access/approval requirements,
3. identify OAuth/scopes or API-key model,
4. define account/location mapping,
5. define webhook/event authority,
6. implement idempotency,
7. define retry and dead-letter behavior,
8. encrypt tokens at rest,
9. never expose provider secrets to browser code,
10. record audit/provenance for important state changes.

## Webhooks
Webhook services should include:
- signature verification
- timestamp/replay validation where supported
- idempotency keys/event IDs
- deterministic tenant/location resolution
- safe retry semantics
- no secret/token logging

## External status
Do not invent extra provider states to compensate for unclear UI. Normalize provider states into a small explicit internal model and retain the raw provider status separately for debugging/provenance.

## Live vs simulated
Every integration surface should make it obvious whether data is:
- live
- sandbox/test
- simulated/mock
- stale/unavailable
