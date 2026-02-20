import { initWaaP } from '@human.tech/waap-sdk';
import type { AuthenticationMethod, SocialProvider } from '@human.tech/waap-interface-core';

export type AuthIntent = 'signin' | 'signup';

let initialized = false;

function getWaaPConfig() {
  const authenticationMethods: AuthenticationMethod[] = ['social'];
  const allowedSocials: SocialProvider[] = ['bluesky'];

  return {
    authenticationMethods,
    allowedSocials,
    showSecured: true,
  };
}

function ensureWaaP() {
  if (typeof window === 'undefined') {
    throw new Error('WaaP can only be initialized in the browser');
  }

  if (!initialized) {
    initWaaP({
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      config: getWaaPConfig(),
      project: {
        name: 'Plasmmer Accounts',
        entryTitle: 'Continue with WaaP',
      },
    });
    initialized = true;
  }

  if (!window.waap) {
    throw new Error('WaaP provider was not initialized');
  }

  return window.waap;
}

export type AccountBootstrapResponse = {
  accountId: string;
  blueskyDid: string | null;
  address: string | null;
  loginMethod: string | null;
  sessionFlags: {
    needsWaaPReauth: boolean;
    walletUnlinked: boolean;
  };
  metadata?: {
    provider: 'waap';
    createdAt: string;
    updatedAt: string;
  };
};

export async function connectWaaP(_intent: AuthIntent): Promise<string[]> {
  const waap = ensureWaaP();
  const accounts = (await waap.request({ method: 'eth_requestAccounts' })) as string[];

  if (accounts.length > 0) {
    return accounts;
  }

  await waap.login();
  return (await waap.request({ method: 'eth_requestAccounts' })) as string[];
}

export async function disconnectWaaP() {
  const waap = ensureWaaP();
  await waap.logout();
}

export async function fetchAccountBootstrap(): Promise<AccountBootstrapResponse> {
  const waap = ensureWaaP();
  const loginMethod = waap.getLoginMethod();

  if (!loginMethod) {
    return {
      accountId: 'anonymous',
      blueskyDid: null,
      address: null,
      loginMethod: null,
      sessionFlags: {
        needsWaaPReauth: true,
        walletUnlinked: true,
      },
    };
  }

  const accounts = (await waap.request({ method: 'eth_accounts' })) as string[];
  const address = accounts[0] ?? null;

  if (!address) {
    return {
      accountId: 'waap_unlinked',
      blueskyDid: null,
      address: null,
      loginMethod,
      sessionFlags: {
        needsWaaPReauth: true,
        walletUnlinked: true,
      },
    };
  }

  const res = await fetch('/api/accounts/bootstrap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      loginMethod,
      blueskyDid: null,
    }),
  });

  if (!res.ok) {
    throw new Error('Backend account bootstrap failed');
  }

  return (await res.json()) as AccountBootstrapResponse;
}
