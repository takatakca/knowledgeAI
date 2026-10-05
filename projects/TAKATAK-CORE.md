# TAKATAK Core

## Purpose

TAKATAK is the central platform and control plane for the broader ecosystem.

## Current architectural direction

Modern TAKATAK work uses a Next.js/React/TypeScript/Tailwind stack with PostgreSQL/Supabase-compatible data and Prisma-based server access.

Core platform concepts:
- users and master identity
- workspaces
- clients / organizations
- brands
- locations
- memberships and permissions
- entitlements/subscriptions
- integrations
- automation / AI workforce
- reputation
- social
- listings
- advertising
- inbox/campaigns
- reporting and analytics

## Control-plane principle

The main TAKATAK dashboard provides shared administration and platform services. Independent products should remain independent experiences while consuming shared TAKATAK capabilities through controlled APIs and entitlements.

## Infrastructure direction

Central production is moving toward containerized deployment through Coolify, with separated web/API/worker/webhook responsibilities as the platform grows.

## Knowledge relationship

This repository is intentionally separate from TAKATAK application code. TAKATAK will later retrieve curated knowledge from a backend indexing/search service built on top of Knowledge TakaTak.
