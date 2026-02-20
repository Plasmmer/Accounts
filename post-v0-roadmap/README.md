# Post-v0 Roadmap — Plasmmer Accounts

This folder consolidates the roadmap context provided for Plasmmer Accounts after the initial v0 framing.

## Phase 0 — Plasmmer Accounts v0

### Core direction
- Replace the earlier Zama + Arcium FHE-for-MPC path (for the initial release) with:
  - Bluesky account creation/login
  - WaaP.xyz derivation of an Ethereum address
- Product naming for this phase: **Plasmmer Accounts v0**.

### Adoption targets
Use v0 signup/login flows in ecosystem projects such as:
- RunnyCar
- GamlrOnchain
- Megaxolotls
- heyplate/lenstter

## Phase 0.5 — Safe-based continuity

### Core direction
After deriving wallet via AT/Bluesky -> WaaP, use it as signer for a Gnosis Safe so the Safe becomes the multi-EVM public address.

### Upgrade continuity goal
Keep the public address stable while enabling a later v1 upgrade path (FHE + Shamir) where a newly derived seed-based address can become signer without changing the main Safe-facing address.

### Operational concern to solve
For long-lived multichain Safe continuity, maintain consistency around owners + threshold + salt, while handling key rotation safely.

### Resilience addition
Optionally include a local `plasmmerwallet/plasmmeraccounts` Ethereum key as a Safe owner (still with low signing threshold), reducing dependency risk if Bluesky/WaaP is unavailable.

## Inputs to review for v1 preparation

### Reference materials mentioned
- Alternative contract/client materials focused on PlasmmerWallet FHE with less context overhead.
- Seed-derivation plan references covering QRL + AT/Bluesky and multi-chain derivation strategy.

### Assets/keys to derive from the seed (v1 upgrade scope)
- Ethereum (general + Zama-side 1/2 MPC-FHE role)
- Solana (Arcium-side 2/2 MPC-FHE role)
- Upgraded Bluesky signer + rotation keys
- Bitcoin
- Starknet
- Aztec + note model
- QRL Zond EVM

## Plasmmer Pay Infra direction

Build a private ENS-like naming/payment layer (potentially on Aztec or later Zama+Arcium path) so value can be sent to an @identifier without exposing direct account-level mapping in a way that facilitates broad balance surveillance.

## Phase 1 — Plasmmer Accounts v1

### Direction summary
- Introduce stronger key-management architecture (Shamir + FHE route under review).
- Preserve upgradeability from v0.5 Safe model.
- Continue evaluation of recovery, signer rotation, and social/login-based auth integration.

### Security/ops notes carried forward
- Preserve session and login-attempt logging, including failed login attempts.
- For failed email/password and PIN login attempts, log interacting on-chain identity (0x context) for later owner visibility in account activity dashboards.

## Immediate to-dos

- [ ] Draft a precise v0 architecture diagram (Bluesky + WaaP + app session model).
- [ ] Define Safe deployment/ownership model for v0.5 with rotation strategy.
- [ ] Build migration checklist: v0 -> v0.5 -> v1.
- [ ] Define threat model for provider downtime (Bluesky/WaaP) and fallback keys.
- [ ] Specify account activity/audit log schema for failed attempts + sessions.

## Quick Start-informed roadmap updates (2026-02-20)

- Add a post-v0 task to evaluate when/if Sui support should move from documented seam to implemented feature (`initWaaPSui`).
- Standardize a config-governance workflow: playground snapshot -> PR checklist -> runtime config parity validation.
- Treat provider compatibility guarantees as contract tests (EIP-1193 conformance across app integrations).
