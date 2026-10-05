# 1LV

## Product
1LV is part of the TAKATAK ecosystem and is intended to integrate with TAKATAK rather than remain a completely isolated identity/system island.

Known domain: `1lv.ca`.

## Hosting direction
Node.js + Vite + Express deployment to constrained cPanel/MochaHost infrastructure has required CI-built Linux artifacts rather than heavy production-server builds.

## Release pattern
Recommended artifact shape:
- `dist`
- server runtime files
- Linux production dependencies when needed
- versioned `releases/<SHA>`
- `CURRENT` / `PREVIOUS`
- persistent `shared/`
- Passenger restart trigger
- health verification
- rollback

## Integration principle
TAKATAK remains the central identity/control-plane authority where shared user/business identity is required.
