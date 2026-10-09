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
