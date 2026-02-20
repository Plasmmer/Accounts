# 2026 Implementation Plan: Plasmmer Accounts v0

## Objective

Ship a production-ready account layer that combines:

1. **WaaP.xyz-first authentication with Bluesky as the only login option**
2. **WaaP.xyz wallet session + Ethereum address derivation**

for reuse across:

- RunnyCar
- GamlrOnchain
- Megaxolotls
- heyplate/lenstter

## Phase 1 — Reference implementation (single app)

- Add app-shell account module (`accounts-core`) with:
  - identity state machine
  - wallet state machine
  - account bootstrap API client
- Add WaaP auth callback route with Bluesky-only token validation endpoint.
- Add WaaP provider at root and account context bridge.
- Persist mapping: `bluesky_did -> account_id -> eth_address`.

### Exit criteria

- New user can complete WaaP sign-in (Bluesky-only identity) and receive linked Ethereum address.
- Returning user can restore both identity and wallet session.
- Failure states surface actionable UI.

## Phase 2 — Harden auth and recovery paths

- Add explicit partial-session state (`identity_ok_wallet_pending`).
- Add address mismatch and relinking policy/UX.
- Add session freshness requirements for sensitive actions.
- Add telemetry events for each auth/wallet state transition.

### Exit criteria

- All critical failure paths tested in staging.
- Incident runbook for WaaP/Bluesky outage exists.

## Phase 3 — Multi-app rollout

- Extract shared package for auth + wallet orchestration.
- Implement app adapters for each target app.
- Standardize analytics and support playbooks.

### Exit criteria

- At least 2 downstream apps fully integrated.
- Remaining apps have implementation PRs opened.

## Engineering tasks (starter backlog)

1. Define TypeScript interfaces:
   - `IdentityState`
   - `WalletState`
   - `AccountBootstrapResponse`
2. Implement account bootstrap endpoint contract.
3. Add feature flag: `plasmmer_accounts_v0_enabled`.
4. Add auth integration tests for:
   - first-time signup
   - returning login
   - WaaP/Bluesky identity success + wallet failure
   - WaaP session success + Bluesky verification failure
5. Add observability dashboard for onboarding funnel.

## Non-goals for v0

- Custom MPC/FHE infra.
- Multi-provider wallet abstraction.
- Full account migration from every legacy auth method.
