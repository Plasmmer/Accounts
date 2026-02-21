'use client';

import { useState } from 'react';
import { useWaaP } from '../components/waap.context';
import { fetchAccountBootstrap } from '../lib/identity';

function GoogleIcon() {
  return <span aria-hidden="true" style={{ fontSize: 18 }}>🟢</span>;
}

export default function Home() {
  const { isConnected, address, signIn, signUp, logout, refreshBootstrap, status, error, intent, bootstrap } = useWaaP();
  const [bootstrapRaw, setBootstrapRaw] = useState<string>('not loaded');
  const isConnecting = status === 'connecting';

  async function loadBootstrap() {
    try {
      const data = await fetchAccountBootstrap();
      setBootstrapRaw(JSON.stringify(data, null, 2));
    } catch (e) {
      setBootstrapRaw(e instanceof Error ? e.message : 'bootstrap error');
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 760, margin: '3rem auto' }}>
      <h1>Plasmmer Accounts v0 Starter</h1>
      <p>WaaP SDK integration enabled with Google as the only auth option for now.</p>

      <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
        <h2>Auth Entry</h2>
        <p>Sign in or signup calls WaaP directly. The modal currently keeps only Google enabled.</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={signIn} disabled={isConnecting}>
            <GoogleIcon /> Sign in via WaaP
          </button>
          <button onClick={signUp} disabled={isConnecting}>
            <GoogleIcon /> Signup via WaaP
          </button>
        </div>

        <h2>Wallet State</h2>
        <p>Status: {status}</p>
        <p>Last intent: {intent}</p>
        <p>Bootstrap mode: {process.env.NEXT_PUBLIC_ACCOUNTS_BOOTSTRAP_MODE === 'api' ? 'api route' : 'local (pure JS)'}</p>
        {error ? <p style={{ color: 'crimson' }}>Error: {error}</p> : null}
        {isConnected ? <p>Connected address: {address}</p> : <p>Wallet not connected</p>}
        {bootstrap?.metadata ? (
          <p>
            Address state for this login: <strong>{bootstrap.metadata.addressStatus}</strong> ({bootstrap.metadata.storage})
          </p>
        ) : null}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={logout} disabled={!isConnected || isConnecting}>Logout</button>
          <button onClick={refreshBootstrap} disabled={isConnecting}>Refresh Bootstrap</button>
          <button onClick={loadBootstrap} disabled={isConnecting}>Load Account Bootstrap</button>
        </div>
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h2>Bootstrap Response</h2>
        <pre>{bootstrapRaw}</pre>
      </section>
    </main>
  );
}
