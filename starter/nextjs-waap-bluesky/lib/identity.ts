export type AccountBootstrapResponse = {
  accountId: string;
  blueskyDid: string;
  address: string | null;
  sessionFlags: {
    needsWaaPReauth: boolean;
    walletUnlinked: boolean;
  };
};

export async function handleBlueskyCallback(code: string) {
  const res = await fetch('/api/auth/bluesky/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) throw new Error('Bluesky callback exchange failed');
  return res.json();
}

export async function fetchAccountBootstrap() {
  const res = await fetch('/api/account/bootstrap');
  if (!res.ok) throw new Error('Account bootstrap failed');
  return (await res.json()) as AccountBootstrapResponse;
}
