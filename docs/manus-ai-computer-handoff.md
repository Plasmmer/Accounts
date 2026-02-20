# Manus AI Computer Handoff

Date: 2026-02-19 19:58

## Context completed by Codex

- Project direction updated to **WaaP-first integration**.
- **Bluesky remains required**, but only as the identity provider inside WaaP (no direct Bluesky login flow in Plasmmer UI).
- Starter/docs language updated to reflect this product decision.

## What Manus AI Computer should continue

Manus is responsible for the **UI design and implementation** of:

1. Plasmmer Accounts **Login** page
2. Plasmmer Accounts **Signup** page

## UI requirements for Manus

- Keep a single CTA pattern: **Continue with WaaP**.
- Include helper text that Bluesky is used within WaaP (not directly on Plasmmer).
- Remove/avoid any standalone "Continue with Bluesky" button in the app UI.
- Design for states:
  - idle
  - connecting/authenticating
  - wallet connected
  - partial session (identity ok, wallet pending)
  - error + retry

## Suggested deliverables

- High-fidelity mockups for login/signup.
- Responsive implementation in the Next.js starter.
- Component-level states for loading, success, and failure.
- Copy variants for onboarding and recovery states.

## Manus scope limitations (important)

- Manus is **UI-focused only** for this handoff.
- Do **not** own or redesign the Next.js `/api/*` directory contracts in this task.
- Assume backend/API routes and data persistence are handled outside Manus scope.
- Manus may use mocked local UI state for screens, but should not introduce a new production database implementation.
- If API payloads are needed for UI state demos, use interface mocks aligned to existing contracts and document assumptions.


## Continuation references

- See `docs/manus-claudecode-resume-notes.md` for environment limitations and the exact backend/SDK tasks to resume once network access is available.

## Quick Start constraints for Manus (added 2026-02-20)

- UI must assume WaaP is initialized through official `initWaaP` config before auth CTA becomes actionable.
- Keep login CTA disabled until provider availability checks pass (`window.waap` ready).
- Preserve copy clarity that EVM wallet behavior is WaaP-provider driven (EIP-1193 path), not a custom in-app wallet modal.
- If proposing Sui visuals, tag them as post-v0 exploratory only (actual v0 remains EVM-first).
