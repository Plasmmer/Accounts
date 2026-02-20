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
    storage: 'local' | 'api';
    addressStatus: 'new' | 'existing' | 'unknown';
    createdAt: string;
    updatedAt: string;
  };
};

type LocalAccountRecord = {
  accountId: string;
  loginMethod: string;
  address: string;
  blueskyDid: string | null;
  createdAt: string;
  updatedAt: string;
};

const LOCAL_ACCOUNTS_KEY = 'plasmmer.accounts.v0.local';

function makeLocalAccountId(loginMethod: string) {
  const normalized = loginMethod.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'social';
  return `acct_local_${normalized.slice(0, 16)}`;
}

function loadLocalAccounts(): Record<string, LocalAccountRecord> {
  const raw = window.localStorage.getItem(LOCAL_ACCOUNTS_KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, LocalAccountRecord>;
  } catch {
    return {};
  }
}

function saveLocalAccounts(data: Record<string, LocalAccountRecord>) {
  window.localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(data));
}

function shouldUseLocalBootstrap() {
  return process.env.NEXT_PUBLIC_ACCOUNTS_BOOTSTRAP_MODE !== 'api';
}

function localBootstrapByLoginMethod(input: { loginMethod: string; address: string }): AccountBootstrapResponse {
  const now = new Date().toISOString();
  const records = loadLocalAccounts();
  const existing = records[input.loginMethod];

  if (!existing) {
    const created: LocalAccountRecord = {
      accountId: makeLocalAccountId(input.loginMethod),
      loginMethod: input.loginMethod,
      address: input.address,
      blueskyDid: null,
      createdAt: now,
      updatedAt: now,
    };

    records[input.loginMethod] = created;
    saveLocalAccounts(records);

    return {
      accountId: created.accountId,
      blueskyDid: created.blueskyDid,
      address: created.address,
      loginMethod: created.loginMethod,
      sessionFlags: {
        needsWaaPReauth: false,
        walletUnlinked: false,
      },
      metadata: {
        provider: 'waap',
        storage: 'local',
        addressStatus: 'new',
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
    };
  }

  const updated: LocalAccountRecord = {
    ...existing,
    address: input.address,
    updatedAt: now,
  };

  records[input.loginMethod] = updated;
  saveLocalAccounts(records);

  return {
    accountId: updated.accountId,
    blueskyDid: updated.blueskyDid,
    address: updated.address,
    loginMethod: updated.loginMethod,
    sessionFlags: {
      needsWaaPReauth: false,
      walletUnlinked: false,
    },
    metadata: {
      provider: 'waap',
      storage: 'local',
      addressStatus: existing.address === input.address ? 'existing' : 'new',
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    },
  };
}

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

  if (shouldUseLocalBootstrap()) {
    return localBootstrapByLoginMethod({
      loginMethod,
      address,
    });
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

  const payload = (await res.json()) as AccountBootstrapResponse;
  return {
    ...payload,
    metadata: payload.metadata
      ? {
          ...payload.metadata,
          storage: 'api',
          addressStatus: 'unknown',
        }
      : undefined,
  };
}
