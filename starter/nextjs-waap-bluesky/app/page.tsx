'use client';

import { useState } from 'react';
import { useWaaP } from '../components/waap.context';
import { fetchAccountBootstrap } from '../lib/identity';

function BlueskyIcon() {
  return <span aria-hidden="true" style={{ fontSize: 18 }}>🦋</span>;
}

export default function Home() {
  const { isConnected, address, signIn, signUp, logout, refreshBootstrap, status, error, intent } = useWaaP();
  const [bootstrap, setBootstrap] = useState<string>('not loaded');

  async function loadBootstrap() {
    try {
      const data = await fetchAccountBootstrap();
      setBootstrap(JSON.stringify(data, null, 2));
    } catch (e) {
      setBootstrap(e instanceof Error ? e.message : 'bootstrap error');
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 760, margin: '3rem auto' }}>
      <h1>Plasmmer Accounts v0 Starter</h1>
      <p>WaaP SDK integration enabled with Bluesky as the only social auth option.</p>

      <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
        <h2>Auth Entry</h2>
        <p>Sign in or signup calls WaaP directly. WaaP handles Bluesky-based key derivation/recovery flow.</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={signIn}>
            <BlueskyIcon /> Sign in via WaaP
          </button>
          <button onClick={signUp}>
            <BlueskyIcon /> Signup via WaaP
          </button>
        </div>

        <h2>Wallet State</h2>
        <p>Status: {status}</p>
        <p>Last intent: {intent}</p>
        {error ? <p style={{ color: 'crimson' }}>Error: {error}</p> : null}
        {isConnected ? <p>Connected address: {address}</p> : <p>Wallet not connected</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={logout}>Logout</button>
          <button onClick={refreshBootstrap}>Refresh Bootstrap</button>
          <button onClick={loadBootstrap}>Load Account Bootstrap</button>
        </div>
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h2>Bootstrap Response</h2>
        <pre>{bootstrap}</pre>
      </section>
    </main>
  );
}
