import { NextResponse } from 'next/server';
import { createAccountsAdapter } from '../../../../lib/server/accounts-adapter';

type BootstrapRequestBody = {
  address?: string;
  blueskyDid?: string | null;
  loginMethod?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as BootstrapRequestBody;

  if (!body.address || !body.loginMethod) {
    return NextResponse.json(
      {
        error: 'Missing required fields',
        required: ['address', 'loginMethod'],
      },
      { status: 400 },
    );
  }

  const adapter = createAccountsAdapter();

  try {
    const account = await adapter.upsertByAddress({
      address: body.address,
      blueskyDid: body.blueskyDid ?? null,
      loginMethod: body.loginMethod,
    });

    return NextResponse.json({
      accountId: account.accountId,
      blueskyDid: account.blueskyDid,
      address: account.address,
      loginMethod: account.loginMethod,
      sessionFlags: {
        needsWaaPReauth: false,
        walletUnlinked: false,
      },
      metadata: {
        provider: account.provider,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown account bootstrap failure',
      },
      { status: 422 },
    );
  }
}
