# Plasmmer Accounts v0

## Overview

**Plasmmer Accounts v0** replaces the earlier Zama/Arcium FHE+MPC direction with a practical identity + wallet onboarding flow:

1. User enters through **WaaP.xyz** authentication.
2. Inside WaaP, the user authenticates with **Bluesky** (only enabled identity option).
3. WaaP derives and manages an **Ethereum address** for seedless app access.

This document is the implementation baseline for product and engineering.

---

## Goals

- Provide a seedless signup/login experience for web3-enabled apps.
- Use WaaP.xyz as the user-facing entry point with Bluesky-only identity inside WaaP.
- Use WaaP.xyz for wallet session management and Ethereum address derivation.
- Standardize integration across multiple downstream projects.

## Non-goals

- Reintroducing phpFox-era account systems.
- Building custom FHE/MPC infrastructure in v0.
- Supporting every wallet provider in the first release.

---

## Core Flow (Signup / Login)

### A. Signup

1. User clicks **Continue with WaaP**.
2. WaaP login modal/page opens with **Bluesky as the only enabled identity option**.
3. User authenticates to Bluesky through WaaP.
4. Backend verifies WaaP-authenticated Bluesky identity and issues an app session token.
5. App initializes WaaP context/provider.
6. WaaP returns wallet context and an EVM-compatible account.
7. App stores the derived Ethereum address linked to the Bluesky identity.
8. User enters the application as an authenticated account.

### B. Login (returning user)

1. User clicks **Continue with WaaP**.
2. WaaP handles identity re-auth via Bluesky (only option).
3. App resolves existing account record.
4. App restores WaaP session (or requests re-auth if expired).
5. App confirms Ethereum address binding and enters with active identity + wallet context.

### C. Failure/Recovery Paths

- **WaaP/Bluesky identity success, wallet failure:** create partial session state and prompt wallet retry.
- **WaaP success, Bluesky verification failure:** do not finalize app login.
- **Address mismatch on returning user:** lock high-risk actions, require explicit re-link flow.
- **Provider outage:** fallback banner + retry queue for wallet-dependent actions.

---

## Architecture

### Frontend

- Add a `WaaPProvider` at app root.
- Use a `useWaaP`-style hook in account-aware components.
- Keep identity state (Bluesky) and wallet state (WaaP) explicit and separately observable.

### Backend

- Verify Bluesky identity tokens.
- Map `bluesky_user_id -> internal_account_id -> ethereum_address`.
- Expose account bootstrap endpoint that returns:
  - account id
  - linked address
  - session flags (`needs_waap_reauth`, `wallet_unlinked`, etc.)

### Data Model (minimum)

- `accounts`
  - `id`
  - `bluesky_did` (unique)
  - `created_at`, `updated_at`
- `wallet_links`
  - `account_id`
  - `provider` (`waap`)
  - `chain_namespace` (`eip155`)
  - `address`
  - `status` (`active`, `pending_relink`, `revoked`)

---

## Security & Trust Assumptions

- Key custody and key-share handling are delegated to WaaP’s architecture.
- App never stores raw private keys.
- Account binding must require a verified Bluesky identity.
- Sensitive actions should require session freshness checks.
- Add abuse controls for account creation bursts.

---

## Integration Targets

Plasmmer Accounts v0 should be reusable in:

- RunnyCar
- GamlrOnchain
- Megaxolotls
- heyplate / lenstter

### Integration checklist (per app)

- [ ] Add shared Plasmmer Accounts v0 auth module.
- [ ] Add WaaP login button/entry route (Bluesky-only within WaaP).
- [ ] Add WaaP provider + wallet session handling.
- [ ] Persist/consume linked Ethereum address.
- [ ] Gate wallet-required features on wallet availability.
- [ ] Add telemetry for auth and wallet failure modes.

---

## Open Questions

- Exact Bluesky auth method and token verification strategy to standardize across apps.
- Address-linking policy for users who already have a legacy wallet in an integrated app.
- Session lifetime defaults and re-auth thresholds.
- Supported EVM chains for v0 launch.
- Gas sponsorship policy for first-party transactions.

---

## Delivery Readiness (v0)

- [ ] Auth spec approved by product + backend.
- [ ] WaaP integration validated in one reference app.
- [ ] Account-linking migration policy documented.
- [ ] Incident playbook defined for provider downtime.
- [ ] Shared SDK/module extracted for multi-app reuse.
