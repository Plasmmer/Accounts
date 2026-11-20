# Manus / ClaudeCode Resume Notes

Historical implementation notes: 2026-02-20.

## Current status (2026-11-20)

The v0 scope is explicitly **client-only**. The former optional API bootstrap route and in-memory server adapter have been removed. The app stores browser-local metadata keyed by the full normalized EVM address.

The current code no longer uses waap.getLoginMethod() as an account identity. It must not be interpreted as a Bluesky DID or as a unique person identifier.

The browser-local account record is not a globally registered Plasmmer identity, is not synchronized between devices/origins, and does not establish a verified Bluesky identity. blueskyDid remains null.

## Historical work completed on 2026-02-20

- Integrated @human.tech/waap-sdk into the Next.js starter.
- Initialized WaaP with social authentication configuration.
- Added a React context for wallet state.
- Added an initial bootstrap flow and an in-memory API adapter as an early experiment. This backend experiment is no longer part of the v0 product scope.

## Remaining work

See ToDo.md for the active list, including:
- WaaP web SDK 2.x and Bluesky compatibility investigation.
- Dependency refresh and lockfile regeneration.
- Browser/unit tests and CI.
- Optional future DID verification, portable identity, and wallet linking.
- Solidity mock redesign and security tests.

## Historical SDK observations

The original 2026-02-20 implementation inspected @human.tech/waap-sdk 1.2.0 and @human.tech/waap-interface-core 0.2.0, whose types accepted bluesky in the configured social-provider list.

That observation establishes support in the inspected version only. It does not establish continued support in later web SDK releases. The current WaaP web documentation and the separate React Native SDK documentation differ in their listed social providers; see ToDo.md for the unresolved version-by-version check.
