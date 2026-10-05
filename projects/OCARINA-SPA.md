# Ocarina Spa

## Project
Known Lovable project: `ocarinaspa`.

## Hosting direction
Self-host rather than depend on Lovable as the permanent production host.

The project has used a React/Vite/Node build model.

## cPanel deployment model
Preferred pattern:
- private GitHub repository
- cPanel Git Version Control or CI-managed deployment
- repository outside the public document root
- build with a trusted build environment
- deploy only public client artifacts to the web root

For a Vite/client build, public hosting should receive only the generated client assets. Do not expose `.env`, source-only files, service credentials, server-only code or development dependencies.
