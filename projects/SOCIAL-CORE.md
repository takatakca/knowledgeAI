# TAKATAK Social Core

## Goal

Build a native TAKATAK social-media management platform. Metricool can be used as a UX/product benchmark, but TAKATAK owns its implementation and data model.

## Verified technical direction

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase authentication
- Prisma
- PostgreSQL/Supabase
- pnpm
- tenant isolation through workspace/membership/brand/location

## Platform integrations

Planned/direct-provider work includes:
- Meta / Facebook / Instagram
- Google Business Profile
- YouTube
- LinkedIn
- TikTok
- Pinterest
- X
- Bluesky
- Twitch

Provider endpoints/scopes must be revalidated against current official documentation before implementation.

## Security rules

- Prisma is server-side only.
- Use permission guards.
- Audit sensitive writes.
- Use same-origin protections for writes where applicable.
- Do not expose provider tokens.
- Do not use editable user metadata as the authorization source.
