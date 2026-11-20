'use client';

import { useWaaP } from '../components/waap.context';

export default function Home() {
  const { isConnected, address, connect, logout, refreshBootstrap, status, error, bootstrap } = useWaaP();
  const isConnecting = status === 'connecting';

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 760, margin: '3rem auto', padding: '0 1rem' }}>
      <h1>Plasmmer Accounts v0 Starter</h1>
      <p>WaaP handles wallet authentication. Plasmmer keeps a small account record locally in this browser.</p>

      <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
        <h2>Authentication</h2>
        <p>Continue with WaaP. The provider handles whether this is a first-time or returning login.</p>
        <button onClick={connect} disabled={isConnecting}>
          {isConnecting ? 'Connecting…' : 'Continue with WaaP'}
        </button>

        <h2>Wallet State</h2>
        <p>Status: {status}</p>
        {error ? <p role="alert" style={{ color: 'crimson' }}>Error: {error}</p> : null}
        {isConnected ? <p>Connected address: {address}</p> : <p>Wallet not connected</p>}
        {bootstrap?.metadata ? (
          <p>
            Local account: <strong>{bootstrap.metadata.addressStatus}</strong> ({bootstrap.metadata.storage})
          </p>
        ) : null}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={logout} disabled={!isConnected || isConnecting}>Log out from WaaP</button>
          <button onClick={refreshBootstrap} disabled={isConnecting}>Refresh local account</button>
        </div>
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h2>Local Account Record</h2>
        <p>
          This record is stored in browser localStorage. It is not a server account, a verified Bluesky identity,
          or a cross-device profile.
        </p>
        <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
          {bootstrap ? JSON.stringify(bootstrap, null, 2) : 'No account record loaded.'}
        </pre>
      </section>
    </main>
  );
}
