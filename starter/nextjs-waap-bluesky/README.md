# Plasmmer Accounts v0 — Next.js Starter (Bluesky + WaaP)

This starter demonstrates the minimal integration pattern requested for **Plasmmer Accounts v0**:

- identity bootstrap via Bluesky callback endpoint (stubbed)
- wallet onboarding via a `WaaPProvider` + `useWaaP` hook
- linked account bootstrap from backend contract

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
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 3) Replace stubs with your real SDK wiring

The following files are intentionally lightweight and ready to swap with official WaaP SDK calls:

- `components/waap.context.tsx`
- `lib/identity.ts`

## 4) Expected backend endpoints

- `POST /api/auth/bluesky/callback`
- `GET /api/account/bootstrap`

The UI is designed to support partial-session handling:

- identity success + wallet pending
- wallet connected + address shown

## 5) Notes

This starter avoids committing to unofficial SDK APIs. Replace internal TODOs with the exact methods from your selected WaaP package/version.
