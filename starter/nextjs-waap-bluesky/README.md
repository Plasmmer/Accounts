# Plasmmer Accounts v0 — Next.js Starter (Bluesky + WaaP)

This starter now uses the **official WaaP SDK** with a WaaP-first UX and Bluesky as the only social authentication option.

## What works now

- Sign in and Signup buttons call WaaP SDK directly.
- WaaP is initialized with `authenticationMethods: ['social']` and `allowedSocials: ['bluesky']`.
- Wallet address is requested through `eth_requestAccounts` / `eth_accounts`.
- Login method is resolved via `waap.getLoginMethod()`.
- Account bootstrap works in pure JS (`localStorage`) by default, with optional `POST /api/accounts/bootstrap` mode.

## 1) Install

```bash
npm install
npm run dev
```

## 2) Configure env

Create `.env.local`:

```bash
NEXT_PUBLIC_WAAP_API_KEY=replace_me
NEXT_PUBLIC_WAAP_ENV=sandbox
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=optional_but_recommended
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ACCOUNTS_BOOTSTRAP_MODE=local # default is local, set api to force /api/accounts/bootstrap
```

## 3) Integration seams

These files are the core integration points:

- `components/waap.context.tsx`
- `lib/identity.ts`

## 4) Bootstrap modes

### Local-first (default, no custom backend required)

- `fetchAccountBootstrap` persists `loginMethod -> accountId/address` in browser `localStorage`.
- Useful for Manus/local testing of **Bluesky login -> new/old Ethereum key** flows with pure JS.
- The UI shows `addressStatus` (`new` / `existing`) for quick validation.

### API mode (optional)

- `POST /api/accounts/bootstrap` upserts `address -> accountId` and returns canonical bootstrap payload.
- Adapter seam lives at `lib/server/accounts-adapter.ts` for swapping in production DB implementations.

## 5) Current scope

- This starter focuses on front-end WaaP orchestration and wallet state.
- Production backend session persistence / account linking must still be implemented in your app backend.

## 6) Notes for Manus

Manus stays UI-focused in this handoff: keep working on login/signup UX states, while backend contract design and production DB rollout remain outside Manus ownership.

## 7) Quick Start parity checklist (official WaaP docs)

This starter is aligned to the official `quick-start` flow:

- ✅ SDK installed via `@human.tech/waap-sdk`
- ✅ WaaP initialized using `initWaaP`
- ✅ Auth/UI configuration applied through init config
- ✅ EVM provider consumed as EIP-1193 (`window.waap`)

Recommended team practice:

- Use WaaP Playground (`https://docs.wallet.human.tech/playground`) to generate config snapshots and copy them into PR notes.
- Keep Sui (`initWaaPSui`) as a documented extension path, not part of v0 acceptance criteria.
