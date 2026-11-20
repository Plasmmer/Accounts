# Plasmmer Accounts v0 — Client-only WaaP Starter

This starter intentionally has **no Plasmmer backend**. WaaP provides the wallet authentication experience; Plasmmer keeps a small, browser-local record keyed by the full normalized EVM address.

## What works

- Initializes WaaP with social authentication configured for Google and Bluesky.
- Opens WaaP authentication from one entry point; WaaP decides whether the user is new or returning.
- Requests EVM accounts through eth_requestAccounts and restores an existing connection through eth_accounts.
- Automatically creates or restores a local account record after connection and when the provider reports account changes.
- Uses a collision-resistant browser-local account ID, unique per wallet address in this browser profile.
- Migrates legacy local records that were keyed by getLoginMethod() when their stored address matches the connected wallet.

## Important scope and trust limits

- No Plasmmer API route, server adapter, database, session server, or cloud persistence is included.
- localStorage is scoped to this browser profile and origin. Clearing browser data removes the local record; another browser/device will create its own record.
- A local account ID is not a globally registered or portable Plasmmer identity.
- The current flow does not retrieve or verify a Bluesky DID. blueskyDid remains null.
- The browser is not a trusted authority. A client-only local record must not be treated as proof of identity or used to authorize valuable actions.
- WaaP remains an external authentication/wallet dependency. Its availability and supported social providers are controlled by WaaP.

## Install and run

    npm install
    npm run dev

Create .env.local only when using WalletConnect features that require a project ID:

    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

No Plasmmer backend environment variables are required.

## Core integration files

- components/waap.context.tsx — React state, provider events, automatic restoration.
- lib/identity.ts — WaaP initialization and browser-local account records.
- types/waap-window.d.ts — TypeScript declaration for window.waap.

## Provider configuration

The currently pinned WaaP SDK is 1.2.0. Its integration config requests social authentication and allows Google plus Bluesky.

Do not assume the Bluesky option is available in every later web SDK release. See docs/ToDo.md for the version investigation and migration gate. The current official WaaP web documentation examples show Google, Twitter, and Discord, while the separate React Native SDK documentation also lists Bluesky. This is not enough evidence to claim that Bluesky was deliberately removed from the web SDK.

## Development checks

    npm run build
    npm run lint

The repository still needs automated unit, browser, and WaaP staging tests; those are tracked in docs/ToDo.md.
