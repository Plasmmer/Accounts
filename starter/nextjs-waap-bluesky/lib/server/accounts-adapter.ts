export type AccountRecord = {
  accountId: string;
  blueskyDid: string | null;
  address: string;
  provider: 'waap';
  loginMethod: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountBootstrapInput = {
  address: string;
  blueskyDid: string | null;
  loginMethod: string;
};

export interface AccountsAdapter {
  upsertByAddress(input: AccountBootstrapInput): Promise<AccountRecord>;
}

const inMemoryAccounts = new Map<string, AccountRecord>();

function isHexAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function normalizeAddress(value: string) {
  return value.toLowerCase();
}

function generateAccountId(address: string) {
  return `acct_${address.slice(2, 14)}`;
}

class InMemoryAccountsAdapter implements AccountsAdapter {
  async upsertByAddress(input: AccountBootstrapInput): Promise<AccountRecord> {
    if (!isHexAddress(input.address)) {
      throw new Error('Invalid EVM address format');
    }

    const normalizedAddress = normalizeAddress(input.address);
    const now = new Date().toISOString();
    const existing = inMemoryAccounts.get(normalizedAddress);

    if (existing) {
      const updated: AccountRecord = {
        ...existing,
        blueskyDid: input.blueskyDid ?? existing.blueskyDid,
        loginMethod: input.loginMethod,
        updatedAt: now,
      };

      inMemoryAccounts.set(normalizedAddress, updated);
      return updated;
    }

    const created: AccountRecord = {
      accountId: generateAccountId(normalizedAddress),
      blueskyDid: input.blueskyDid,
      address: normalizedAddress,
      provider: 'waap',
      loginMethod: input.loginMethod,
      createdAt: now,
      updatedAt: now,
    };

    inMemoryAccounts.set(normalizedAddress, created);
    return created;
  }
}

export function createAccountsAdapter(): AccountsAdapter {
  // Adapter seam for production:
  // switch to postgres/prisma/dynamo implementation based on env in real deployment.
  return new InMemoryAccountsAdapter();
}
