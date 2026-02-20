# Plasmmer Accounts

This repository has been reset to focus on **Plasmmer Accounts v0 (2026)**.

## Current focus

- WaaP.xyz as the single authentication entry point.
- Bluesky offered only as the WaaP login option.
- WaaP.xyz-based Ethereum address derivation and wallet session handling.
- Reusable account onboarding module for multiple downstream apps.

## Repository layout

- `docs/plasmmer-accounts-v0.md`: Core architecture and integration specification.
- `docs/2026-implementation-plan.md`: Concrete implementation plan and rollout phases.
- `docs/manus-claudecode-resume-notes.md`: Current integration status + production follow-up checklist for WaaP SDK/backend completion.
- `legacy/`: Archived historical materials moved out of active scope.

## Scope policy

- Active planning/design belongs under `docs/`.
- Legacy artifacts are preserved under `legacy/` for reference only.

## WaaP Quick Start alignment (2026-02-20)

Based on official docs at `https://docs.wallet.human.tech/quick-start`, active planning now assumes:

- Baseline integration is the 3-step flow: **install SDK -> initialize `initWaaP` -> customize config**.
- EVM integration must treat `window.waap` as the EIP-1193 provider compatible with wagmi/ethers/viem/plain JS.
- Configuration decisions should explicitly track: `authenticationMethods`, `allowedSocials`, project branding fields, and style settings.
- Sui support exists through `initWaaPSui`; it is not in v0 scope but is now documented as a future extension seam.
- Team can use WaaP Playground (`/playground`) to generate/validate config before shipping.

## Screenshots

Atualmente, o starter Next.js possui a home (`/`) e também layouts visualizáveis para as telas criadas na pasta `claude-work-190226`.

| Tela | Origem | Preview |
|---|---|---|
| Home (`/`) | Starter atual | ![Tela inicial do Plasmmer Accounts v0 Starter](docs/screenshots/home-screen.png) |
| Claude — Plasmmmer Profile (`/claude/profile`) | `claude-work-190226/PlasmmmerProfile.jsx` | ![Preview da página Plasmmmer Profile](docs/screenshots/claude-profile.png) |
| Claude — Settings (`/claude/settings`) | `claude-work-190226/SettingsPage.jsx` + atualização OpenClawd agents | ![Preview atualizado da página Settings Dashboard](docs/screenshots/claude-settings.png) |
| Claude — Settings Additions (`/claude/settings-additions`) | `claude-work-190226/SettingsAdditions.jsx` | ![Preview da página Settings Additions](docs/screenshots/claude-settings-additions.png) |
| Claude — App Access Request (`/claude/access-request`) | Mock novo de consentimento Plasmmer Account | ![Preview da tela de solicitação de acesso](docs/screenshots/claude-access-request.png) |
