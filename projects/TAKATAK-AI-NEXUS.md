# TAKATAK AI Nexus

## Purpose

TAKATAK AI Nexus is the unified capability/orchestration layer for professional AI work across TAKATAK and authorized client projects.

The user chooses an outcome such as:
- create an ad;
- create image/video/audio/music;
- create a voiceover/avatar;
- analyze video or documents;
- research;
- code;
- automate;
- publish;
- build a campaign.

TAKATAK selects the appropriate provider/model/workflow.

## Provider model

Providers are interchangeable engines, not the customer-facing product.

Known/target providers include OpenAI/ChatGPT, Anthropic/Claude, Codex, Cursor, Runway, TwelveLabs, ElevenLabs, Higgsfield, HeyGen, Arcads, Creatify, Songer/Suno, Riven where verified, and future providers.

Never mark an integration connected without real runtime evidence.

## Client independence

AI Nexus is a TAKATAK managed service.

Client applications integrate through a versioned adapter/API. Their application code must remain deployable/transferable without embedding TAKATAK provider secrets or requiring direct access to TAKATAK databases.

A transferred client can:
- replace TAKATAK AI Nexus with another implementation;
- keep the adapter contract;
- lose only the TAKATAK-managed AI features/services not included in the transfer.

## Core services

- capability registry
- provider/model registry
- routing policy
- workspace/project scope
- business/brand knowledge retrieval
- async generation jobs
- asset library
- cost/usage metering
- approvals
- audit log
- provider health
- fallback routing
- client adapter/API

## Professional knowledge boundary

Use `knowledgeAI` and authorized business/project sources. Personal/family/legal/health/private-life material must not be automatically mixed into professional client work.

## Deployment

Primary application remains `takatak-v1`; production infrastructure direction is Contabo VPS + Coolify with existing external managed services retained where appropriate.

Heavy AI generation must run asynchronously through workers/queues rather than blocking web requests.
