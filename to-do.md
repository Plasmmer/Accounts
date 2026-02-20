# To-Do: Main Guide for `claude-work-190226`

This guide tracks the files moved into `claude-work-190226/`, what each one likely owns, and the next cleanup actions.

## 1) Folder purpose

`claude-work-190226/` is now the workspace for the current Plasmmer Accounts design/UX/code artifacts that were previously in the repository root.

## 2) Files moved

- `claude-work-190226/claudecredit.txt`
- `claude-work-190226/globals.css`
- `claude-work-190226/plasmmer-codex-guide.md`
- `claude-work-190226/plasmmer-manus-ux-guide.md`
- `claude-work-190226/settings-additions.css`
- `claude-work-190226/settings.css`
- `claude-work-190226/SettingsAdditions.jsx`
- `claude-work-190226/SettingsPage.jsx`
- `claude-work-190226/PlasmaOrb.svg`
- `claude-work-190226/PlasmmmerIdentity.sol`
- `claude-work-190226/PlasmmmerProfile.jsx`

## 3) Main workstreams

### A. UI + styling consistency

- [ ] Verify import paths after file move (`SettingsPage.jsx`, `SettingsAdditions.jsx`).
- [ ] Consolidate duplicated style rules between `settings.css` and `settings-additions.css`.
- [ ] Ensure `globals.css` load order still matches desired theme priority.
- [ ] Validate `PlasmaOrb.svg` sizing and asset reference paths.

### B. Product + UX guidance

- [ ] Merge overlaps between `plasmmer-codex-guide.md` and `plasmmer-manus-ux-guide.md`.
- [ ] Create one canonical contributor flow (design -> implement -> review).
- [ ] Add explicit acceptance criteria for settings/profile flows.

### C. Smart-contract alignment

- [ ] Review `PlasmmmerIdentity.sol` naming consistency (`Plasmmmer` vs `Plasmmer`).
- [ ] Document expected integration points with profile/settings React components.
- [ ] Add/update test coverage expectations for identity-related behaviors.

### D. Profile/settings feature quality

- [ ] Confirm `PlasmmmerProfile.jsx` and `SettingsPage.jsx` state contracts are compatible.
- [ ] Verify accessibility labels, focus order, and keyboard navigation.
- [ ] Capture pending edge-cases in `claudecredit.txt` notes if needed.

## 4) Recommended next commits

1. Path fixes + build pass.
2. Style merge/refactor.
3. Documentation consolidation.
4. Contract/interface naming cleanup.

## 5) Ownership suggestion

- UX/docs: guides + settings copy.
- Front-end: JSX + CSS alignment.
- Protocol: identity contract and app integration.

## 6) WaaP Quick Start sync tasks (2026-02-20)

- [ ] Add a single source-of-truth config snapshot from WaaP Playground to `docs/`.
- [ ] Confirm `initWaaP` options are documented with rationale (`authenticationMethods`, `allowedSocials`, styles, branding, `showSecured`).
- [ ] Add UI gating rule: disable auth CTAs until provider (`window.waap`) is ready.
- [ ] Capture explicit statement that Sui (`initWaaPSui`) is post-v0 only.
- [ ] Add minimal provider smoke test flow to avoid broken-click UX.

## 7) Social/P2E child-safety, privacy, and legal guardrails (COPPA/ECA)

### A. COPPA (US) + ECA (BR) compliance mapping

- [ ] Map mandatory obligations for child/teen protection in social + play-to-earn contexts, covering age thresholds, parental/legal consent paths, moderation duties, and escalation requirements.
- [ ] Produce a requirement matrix comparing COPPA vs ECA for account creation, chat/social spaces, marketplace access, and rewards mechanics.
- [ ] Define evidence/record-keeping expectations for consent and safety actions without expanding surveillance beyond legal necessity.

### B. Plasmmer Accounts “teen-safe by default” decision

- [ ] Decide whether Plasmmer Accounts should enforce a default mandatory teen-safe mode (opt-out only after age/legal checks where allowed).
- [ ] Document what teen-safe mode changes by default (DM permissions, discoverability, trade restrictions, payout velocity, and session/time limits).
- [ ] Add governance decision log entry: legal rationale, product tradeoffs, and explicit risk acceptance if default teen-safe is not adopted.

### C. Age assurance + minimal-KYC architecture (privacy-preserving)

- [ ] Define age-assurance flow (age-band attestations, parental consent attestations where needed) that avoids storing raw PII onchain.
- [ ] Specify minimum-KYC strategy using offchain verifiers + onchain proofs/claims (attestation pointers, revocation checks, expiry windows).
- [ ] Add explicit data-minimization policy: what must never touch chain, retention windows, and deletion/right-to-review handling.

### D. “Habbo Web3” (PHIland/box now, Habbo-like later) safety controls

- [ ] Define anti-grooming controls for chat/rooms (behavioral flags, trust-level gating, rapid-response moderator workflows).
- [ ] Define anti-scam + anti-rug controls for marketplace and social trading flows (risk labels, cooldowns, warning interrupts).
- [ ] Add transaction limits and friction rules for minors and newly created accounts (daily caps, velocity limits, staged unlocks).
- [ ] Design moderator audit trail with verifiable evidence and minimal-abuse safeguards (tamper-evident logs, scoped access, oversight process).
