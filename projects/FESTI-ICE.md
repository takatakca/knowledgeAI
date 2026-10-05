# FESTI-ICE / Ticketing

## Role
FESTI-ICE is a consumer of reusable TAKATAK ticketing patterns rather than a reason to create an incompatible ticket engine.

## Ticketing architecture rules
Before implementation:
1. perform Phase 0 discovery,
2. separate V1/schema/later scope,
3. define Stripe/payment authority,
4. define operating-day and timezone semantics,
5. define scan policy per ticket,
6. choose opaque vs signed QR based on offline requirements,
7. maintain one ticket authority per event,
8. enforce applicable Québec compliance gates.

Workflow:

**DISCOVER → REUSE → STANDARDIZE → APPROVE → BUILD**

## Security
Public execution rights on sensitive ticketing RPCs should be avoided unless explicitly justified and protected.
