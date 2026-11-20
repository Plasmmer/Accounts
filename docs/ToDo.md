# Plasmmer Accounts — Engineering To-Do

Updated: 2026-11-20

This file tracks work deliberately left outside the client-only correction PR. The current product decision is **no Plasmmer-hosted backend**.

## P0 — Validate provider compatibility before upgrading WaaP

- [ ] Verify whether bluesky remains an accepted SocialProvider in the current web package @human.tech/waap-sdk (latest checked during this review: 2.4.2).
- [ ] Compare published type declarations and runtime behavior for web SDK 1.2.0, 1.3.0, 2.0.0, and the current 2.x release. Record the first version where Bluesky is absent, if any.
- [ ] Ask WaaP support for an authoritative compatibility answer if package declarations or Playground do not settle it.
- [ ] Run an actual browser login test for Google and Bluesky against a staging project before changing the pinned SDK.
- [ ] Compare the maintained official web example at https://github.com/holonym-foundation/waap-examples/blob/main/waap-plain-nextjs/src/waap.config.ts. Its package uses @human.tech/waap-sdk ^2.3.0 and its current allowedSocials example lists Google, Twitter, Discord, and GitHub, but not Bluesky. The current WaaP web docs example also lists Google, Twitter, and Discord without Bluesky.
- [ ] Keep the platform distinction explicit: the separate React Native SDK documentation still lists Bluesky among its social providers. This is evidence that Bluesky is no longer advertised in the current web integration examples, but it does not by itself prove that the web SDK rejects it at runtime.
- [ ] Find a versioned web SDK declaration or run a small compatibility test against 1.2.0, 1.3.0, 2.0.0, 2.3.0, and 2.4.2 to establish whether and when the web SDK type/runtime stopped accepting Bluesky. The SDK source repository/package declarations were not inspectable in this review.
- [ ] Do not infer a political or customer-pressure motive without a release note, issue, commit, or maintainer statement. No such evidence was found in the sources inspected.
- [ ] Once compatibility is confirmed, migrate from @human.tech/waap-sdk 1.2.0 to a selected supported 2.x release. Review breaking API changes (login, logout, provider initialization, environment selection, event lifecycle) rather than changing the version string alone.

## P1 — Client-only identity boundaries

- [ ] Decide whether the local account ID should remain a browser-local UUID or whether the product needs a portable identifier derived from a verified identity.
- [ ] Design optional wallet linking that requires an explicit wallet signature/challenge. Never identify a human by getLoginMethod() or by a truncated wallet address.
- [ ] Investigate a client-only AT Protocol DID resolution/verification flow. Document its trust and phishing limitations; do not treat a user-entered DID or a client-side value as a verified identity.
- [ ] Define behavior when the user changes/replaces a WaaP wallet. Current local records are keyed independently by full normalized wallet address and do not automatically merge identities.
- [ ] Decide whether local profile export/import is needed for browser migration and recovery.
- [ ] Make the browser-local nature explicit in downstream app integrations. Different origins have separate localStorage and therefore separate Plasmmer local records.

## P1 — Dependency and tooling refresh

- [ ] Regenerate package-lock.json through npm after selecting compatible package versions; do not hand-edit integrity hashes.
- [ ] Upgrade Next.js from 15.5.15 to the patched 15.5.29 release on the current 15.x line, then plan a separate Next.js 16 migration.
- [ ] Evaluate React 19.3.x and matching @types/react / @types/react-dom versions as part of the Next.js migration.
- [ ] Update TypeScript and Node type packages to supported versions after checking the selected Next.js compatibility matrix.
- [ ] Replace next lint when migrating to Next.js 16; configure ESLint CLI or Biome explicitly.
- [ ] Reassess dependency advisories with npm audit or an equivalent supply-chain scanner after lockfile regeneration.

## P1 — Tests and CI

- [ ] Add unit tests for EVM address validation, local record creation, legacy migration, malformed storage, quota failures, and address isolation.
- [ ] Add browser tests for first login, returning login, logout, account changes, disconnect events, and page reload restoration.
- [ ] Add staging smoke tests for WaaP initialization and the currently configured social providers.
- [ ] Add CI to run install, typecheck, lint, build, and tests on every PR.
- [ ] Add a test proving two different wallet addresses never share one local account ID.

## P2 — Solidity reference mocks (not production contracts)

- [ ] Keep claude-work-190226/PlasmmmerIdentity.sol explicitly marked as a design mock; do not deploy it.
- [ ] Redesign authorization for PlasmmmerACL.grantAppPermission; an arbitrary caller must not grant permissions on behalf of another owner.
- [ ] Fix Visibility.Followers semantics and document that on-chain data cannot be made private by a canView() function.
- [ ] Add DID ownership proof/verification before any on-chain DID-to-wallet registration.
- [ ] Complete Social Recovery so an approved request changes the authoritative owner/wallet state. Clear approvals safely between requests, prevent request replacement attacks, and define cancellation/expiry.
- [ ] Add membership creation/activation and delegated voting accounting to DAOMembership.
- [ ] Add allowlist membership management and Ceramic access grant/revoke lifecycle.
- [ ] Add Solidity unit, fuzz, and invariant tests before considering any production implementation.
- [ ] Revisit contract architecture against the planned Safe-based continuity model before writing deployable contracts.

## Explicit non-goals under the current product decision

- No Plasmmer-hosted API or serverless bootstrap route.
- No Plasmmer database or server-side session service.
- No automatic cross-device or cross-origin account synchronization.
- No backend DID verification pipeline.

These are not missing implementation tasks for the current client-only v0. They require an explicit product decision to change the no-backend scope.
