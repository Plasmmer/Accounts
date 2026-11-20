# Plasmmer Accounts v0

## Overview

**Plasmmer Accounts v0 is a client-only wallet onboarding layer.** WaaP handles the external wallet authentication experience; Plasmmer stores a lightweight account record in the user's browser.

There is deliberately no Plasmmer-hosted API, database, server-side session service, or bootstrap backend in v0.

## Goals

- Provide a browser-based WaaP entry point for wallet connection.
- Restore a previously connected WaaP EVM address when the provider makes it available.
- Create a stable local record per full EVM wallet address in the current browser profile.
- Keep the integration reusable as a client-side module across Plasmmer apps.

## Non-goals and trust limits

- No backend account registry or cross-device synchronization.
- No Plasmmer-issued server session.
- No server-side identity verification.
- No claim that a locally stored DID or wallet address proves a real-world or social identity.
- No server-side recovery if browser storage is cleared.

## Client flow

1. The user selects Continue with WaaP.
2. WaaP presents its configured authentication options and handles the external authentication experience.
3. The app requests eth_requestAccounts.
4. The app normalizes and validates the full EVM address.
5. A browser-local record is created or loaded using the full normalized address as the storage key.
6. On page reload, the app requests eth_accounts and restores the local record when WaaP exposes a connected address.
7. accountsChanged, chainChanged, connect, and disconnect events update the React account state.

The app does not interpret waap.getLoginMethod() as a person identifier. A wallet connection method is not a social identity or a Plasmmer account ID.

## Local data model

The browser stores records under the origin-scoped key plasmmer.accounts.v0.local.

Each record contains:

- A random browser-local account ID.
- The full lower-case EVM address.
- Creation and last-update timestamps.

The record is keyed by the full normalized address, not by a truncated address or a shared provider-method string. Legacy entries keyed by getLoginMethod() are migrated only when their stored address matches; their old shared account ID is replaced.

blueskyDid remains null until the app has a supported and trustworthy identity-claim flow. The presence of a Bluesky button in WaaP does not, by itself, provide Plasmmer with a verified DID.

## Persistence and recovery

localStorage is scoped to the browser profile and origin:

- A different browser/device creates a separate local record.
- A different app origin has separate storage.
- Clearing site data removes the local record.
- A user who reconnects the same WaaP address in the same browser profile receives the existing local record.

This local record is convenience state only. It must not authorize valuable actions or be treated as an authoritative identity registry.

## WaaP integration

The starter currently pins @human.tech/waap-sdk 1.2.0, initializes the SDK with social authentication, and requests Google plus Bluesky in allowedSocials.

Provider support must be validated against the exact web SDK version. The current official WaaP web docs example does not list Bluesky, while separate React Native SDK docs do. Do not remove or assume support for Bluesky based only on that difference. See ToDo.md for the version investigation and migration gate.

## Integration targets

Downstream apps can reuse the client module, but each origin has its own browser-local record. A shared, portable Plasmmer identity across apps is outside the current v0 scope.
