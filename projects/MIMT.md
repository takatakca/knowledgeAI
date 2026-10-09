# MIMT

## Product

MIMT = Mobile Innovation Modern Telecommunications.

Primary offer:
- SIM / eSIM
- VoIP
- phone numbers
- calling
- SMS/MMS
- voicemail
- telecom billing

## Responsibility split

TAKATAK owns:
- master identity
- Business Registry
- workspaces
- verification
- activation/control-plane experience

MIMT owns:
- telecom accounts
- numbers
- voice
- SMS/MMS
- voicemail
- telecom billing
- Twilio-facing telecom operations

## Integration contract

Use stable cross-system IDs and signed server-side handoffs.

Never put passwords or credentials in redirect URLs.

## Known implementation direction

MIMT has been designed around typed API boundaries and a Canadian bilingual customer experience, with Twilio integrations for communications services.

## Plan documents (2026-10-09)

- [MIMT-REGULATORY.md](MIMT-REGULATORY.md): CRTC, 9-1-1, CCTS, CASL, Law 25, Bill 96, taxes, Vidéotron (research, not legal advice)
- [MIMT-STACK.md](MIMT-STACK.md): services, monthly costs (CAD), cheaper alternatives, phase-1 budget
- [MIMT-MVP.md](MIMT-MVP.md): architecture, TAKATAK handoff, data model, plans, fraud controls, roadmap

## Code and website (2026-10-09)

- Code repository: [`takatakca/mimtcaapp`](https://github.com/takatakca/mimtcaapp) (monorepo: API, mobile app, website, DB schema). Visibility chosen by the owner (public at creation; private recommended).
- **The live mimt.ca (checked 2026-10-09) is a copy of Fongo's website**: it names Fongo and Waterloo, uses Fongo's product names, and lists home phone and internet prices for services MIMT does not offer. It must be replaced by the original site in `MIMTCA/apps/web`, or taken offline.
