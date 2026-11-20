# Plasmmer Accounts

Plasmmer Accounts v0 is a **client-only WaaP wallet onboarding layer**. There is no Plasmmer-hosted backend or cloud account database in the current scope.

## Current focus

- WaaP as the external wallet authentication entry point.
- Browser-local account records keyed by the full normalized EVM address.
- Automatic restoration when WaaP exposes an existing connected account.
- A clear separation between wallet connection, social identity, and a Plasmmer local account ID.

The starter currently configures Google and Bluesky as WaaP social options using the pinned web SDK 1.2.0. Later web SDK releases require a compatibility check before upgrading; the available documentation does not settle whether Bluesky was removed. See docs/ToDo.md.

## Repository layout

- starter/nextjs-waap-bluesky/: client-only Next.js starter.
- docs/plasmmer-accounts-v0.md: v0 scope, client flow, data model, and trust boundaries.
- docs/2026-implementation-plan.md: implementation phases.
- docs/ToDo.md: pending compatibility, dependency, test, identity, and contract work.
- claude-work-190226/: UI and Solidity design references.
- legacy/: archived historical materials.

## Scope policy

- Current v0 account metadata lives in browser localStorage.
- No API route, server adapter, database, or server-side session is part of v0.
- A browser-local account ID is not a portable/global Plasmmer identity.
- Design and implementation gaps belong in docs/ToDo.md.
