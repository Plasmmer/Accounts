import { initWaaP } from '@human.tech/waap-sdk';
import type { AuthenticationMethod, SocialProvider } from '@human.tech/waap-interface-core';

let initialized = false;

const LOCAL_ACCOUNTS_KEY = 'plasmmer.accounts.v0.local';
const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export type AccountBootstrapResponse = {
  /** Browser-local identifier. It is not a globally registered Plasmmer ID. */
  accountId: string;
  address: string | null;
  walletProvider: 'waap' | null;
  /** No verified Bluesky DID is exposed by this client-only flow yet. */
  blueskyDid: null;
  sessionFlags: {
    needsWaaPReauth: boolean;
    walletUnlinked: boolean;
  };
  metadata?: {
    storage: 'local';
    addressStatus: 'new' | 'existing';
    createdAt: string;
    updatedAt: string;
  };
};

type LocalAccountRecord = {
  accountId: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

type WaaPEventProvider = {
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};

function getWaaPConfig() {
  const authenticationMethods: AuthenticationMethod[] = ['social'];
  const allowedSocials: SocialProvider[] = ['google', 'bluesky'];

  return {
    authenticationMethods,
    allowedSocials,
    styles: {
      darkMode: false,
    },
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

/** Exposes the provider for EIP-1193 event subscriptions in the React context. */
export function getWaaPProvider(): WaaPEventProvider {
  return ensureWaaP() as unknown as WaaPEventProvider;
}

function normalizeAddress(address: string) {
  if (!EVM_ADDRESS_PATTERN.test(address)) {
    throw new Error('WaaP returned an invalid EVM address');
  }

  return address.toLowerCase();
}

/** Generate a collision-resistant ID local to this browser profile. */
function makeLocalAccountId() {
  const cryptoApi = window.crypto;

  if (typeof cryptoApi.randomUUID === 'function') {
    return 'acct_local_' + cryptoApi.randomUUID();
  }

  // UUID v4 fallback for browsers that have getRandomValues but not randomUUID.
  const bytes = new Uint8Array(16);
  cryptoApi.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  const uuid = [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');

  return 'acct_local_' + uuid;
}

function loadLocalAccounts(): Record<string, LocalAccountRecord> {
  let raw: string | null;

  try {
    raw = window.localStorage.getItem(LOCAL_ACCOUNTS_KEY);
  } catch {
    throw new Error('Browser storage is unavailable; local account data cannot be read');
  }

  if (!raw) {
    return {};
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Local account data is invalid JSON; it was left untouched');
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Local account data has an invalid format; it was left untouched');
  }

  const records: Record<string, LocalAccountRecord> = {};
  let migrated = false;

  for (const [storedKey, value] of Object.entries(parsed)) {
    if (!value || typeof value !== 'object') continue;

    const candidate = value as Partial<LocalAccountRecord>;
    if (typeof candidate.address !== 'string' || !EVM_ADDRESS_PATTERN.test(candidate.address)) continue;

    const address = candidate.address.toLowerCase();
    const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : new Date().toISOString();
    const updatedAt = typeof candidate.updatedAt === 'string' ? candidate.updatedAt : createdAt;

    // Older releases keyed records by getLoginMethod() (for example, "waap").
    // Migrate only records whose stored address matches; never reuse their shared IDs.
    const accountId =
      storedKey === address && typeof candidate.accountId === 'string'
        ? candidate.accountId
        : makeLocalAccountId();

    records[address] = { accountId, address, createdAt, updatedAt };
    if (storedKey !== address) migrated = true;
  }

  if (migrated) {
    saveLocalAccounts(records);
  }

  return records;
}

function saveLocalAccounts(data: Record<string, LocalAccountRecord>) {
  try {
    window.localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(data));
  } catch {
    throw new Error('Could not save local account data; check browser storage availability and quota');
  }
}

function localBootstrapByAddress(rawAddress: string): AccountBootstrapResponse {
  const address = normalizeAddress(rawAddress);
  const now = new Date().toISOString();
  const records = loadLocalAccounts();
  const existing = records[address];

  const record: LocalAccountRecord = existing
    ? { ...existing, updatedAt: now }
    : {
        accountId: makeLocalAccountId(),
        address,
        createdAt: now,
        updatedAt: now,
      };

  records[address] = record;
  saveLocalAccounts(records);

  return {
    accountId: record.accountId,
    address: record.address,
    walletProvider: 'waap',
    blueskyDid: null,
    sessionFlags: {
      needsWaaPReauth: false,
      walletUnlinked: false,
    },
    metadata: {
      storage: 'local',
      addressStatus: existing ? 'existing' : 'new',
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    },
  };
}

/** Opens WaaP's own authentication UI and returns the connected EVM addresses. */
export async function connectWaaP(): Promise<string[]> {
  const waap = ensureWaaP();
  await waap.login();

  const result = await waap.request({ method: 'eth_requestAccounts' });
  if (!Array.isArray(result)) {
    throw new Error('WaaP returned an unexpected account response');
  }

  return result.filter((account): account is string => typeof account === 'string');
}

/** Ends the WaaP session using the logout method exposed by the pinned SDK version. */
export async function disconnectWaaP() {
  const waap = ensureWaaP();
  await waap.logout();
}

/**
 * Restores the current WaaP account and creates/loads its browser-local record.
 * This is deliberately not a server bootstrap and does not verify a social DID.
 */
export async function fetchAccountBootstrap(): Promise<AccountBootstrapResponse> {
  const waap = ensureWaaP();
  const result = await waap.request({ method: 'eth_accounts' });
  const address = Array.isArray(result) && typeof result[0] === 'string' ? result[0] : null;

  if (!address) {
    return {
      accountId: 'anonymous',
      address: null,
      walletProvider: null,
      blueskyDid: null,
      sessionFlags: {
        needsWaaPReauth: true,
        walletUnlinked: true,
      },
    };
  }

  return localBootstrapByAddress(address);
}
