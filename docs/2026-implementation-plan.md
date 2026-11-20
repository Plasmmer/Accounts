# 2026 Implementation Plan: Plasmmer Accounts v0

## Objective

Ship a reusable, client-only WaaP wallet onboarding module with browser-local account metadata.

The v0 implementation deliberately does not include a Plasmmer backend, hosted database, or server-side session layer.

## Phase 1 — Client reference implementation

- Initialize WaaP once in the browser.
- Configure the selected social authentication methods.
- Request wallet accounts through EIP-1193.
- Store a local account record per full normalized EVM address.
- Restore the local record after reload when WaaP exposes an existing account.
- Listen to provider account, chain, connection, and disconnection events.
- Explain local persistence and trust limits in the UI and README.

### Exit criteria

- First-time connection creates a unique browser-local account ID.
- Reconnecting the same wallet in the same browser profile restores the same ID.
- Two different wallet addresses never share the same local account ID.
- A page reload restores available provider state.
- A provider account change loads the matching local record.
- Logout clears the app state and follows the pinned WaaP SDK's logout behavior.

## Phase 2 — Compatibility and quality

- Verify social-provider support against the exact WaaP web SDK version.
- Add unit and browser tests for local account lifecycle and provider events.
- Add CI for typecheck, lint, build, and tests.
- Refresh dependencies with a regenerated lockfile.
- Document the local-only boundary for every downstream integration.

## Phase 3 — Optional future identity portability

This phase requires a separate product decision and is not required for v0:

- Explore wallet linking with explicit signatures.
- Explore trustworthy AT Protocol DID resolution and claims.
- Define export/import and multi-wallet recovery.
- Decide whether a portable Plasmmer identity is worth introducing a trusted external service or another verifiable mechanism.

## Non-goals

- Plasmmer backend APIs.
- Server-side account persistence.
- Server-side session issuance.
- Cross-device account synchronization.
- Backend DID verification or database account linking.
- Production smart contracts for the settings mock.

## Dependency note

The current starter pins Next.js 15.5.15, React 18.3.1, and WaaP SDK 1.2.0. Dependency refresh is tracked in ToDo.md, because the WaaP 2.x web-provider migration must be validated against the Bluesky requirement and lockfile regeneration must be performed with npm rather than by hand.
