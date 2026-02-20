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
