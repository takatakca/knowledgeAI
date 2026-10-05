# Identity and Multi-Site Standard

## Master identity

TAKATAK owns the master identity/authentication layer.

Child sites should project or authorize that identity rather than creating isolated user masters.

## Cross-product rule

Preferred relationship:

```
person
 → TAKATAK master identity
 → workspace / organization membership
 → product entitlement or authorized relationship
 → child application
```

Child applications should not:
- access the TAKATAK database directly from browser code,
- invent a second master user identity when shared identity is intended,
- call sibling applications directly as an integration shortcut.

Use server-side APIs/contracts.

## Telecom handoff model

For TAKATAK ↔ MIMT, known shared identifiers include:

- `global_user_id`
- `workspace_id`
- `business_id`
- `telecom_account_id`
- `service_subscription_id`
- `phone_number_id`

Use signed server-side handoffs. Never put passwords, credentials or raw secrets into redirect URLs.

## Entitlements

Product access should be driven by server-side entitlement state. Removing an entitlement should normally disable access without deleting underlying customer data, so access can be restored later.
