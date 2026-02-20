# Plasmmer Accounts v0 — Next.js Starter (Bluesky + WaaP)

This starter now uses the **official WaaP SDK** with a WaaP-first UX and Bluesky as the only social authentication option.

## What works now

- Sign in and Signup buttons call WaaP SDK directly.
- WaaP is initialized with `authenticationMethods: ['social']` and `allowedSocials: ['bluesky']`.
- Wallet address is requested through `eth_requestAccounts` / `eth_accounts`.
- Login method is resolved via `waap.getLoginMethod()`.
- Account mapping contract is persisted through `POST /api/accounts/bootstrap`.

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
```

## 3) Integration seams

These files are the core integration points:

- `components/waap.context.tsx`
- `lib/identity.ts`

## 4) Backend contract in this starter

- `POST /api/accounts/bootstrap` upserts `address -> accountId` and returns canonical bootstrap payload.
- Adapter seam lives at `lib/server/accounts-adapter.ts` for swapping in production DB implementations.

## 5) Current scope

- This starter focuses on front-end WaaP orchestration and wallet state.
- Production backend session persistence / account linking must still be implemented in your app backend.

## 6) Notes for Manus

Manus stays UI-focused in this handoff: keep working on login/signup UX states, while backend contract design and production DB rollout remain outside Manus ownership.
