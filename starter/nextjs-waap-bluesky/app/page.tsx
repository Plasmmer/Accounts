'use client';

import { useState } from 'react';
import { useWaaP } from '../components/waap.context';
import { fetchAccountBootstrap } from '../lib/identity';

export default function Home() {
  const { isConnected, address, login, logout, status, error } = useWaaP();
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
    <main style={{ fontFamily: 'sans-serif', maxWidth: 720, margin: '3rem auto' }}>
      <h1>Plasmmer Accounts v0 Starter</h1>
      <p>Bluesky identity + WaaP wallet onboarding baseline.</p>

      <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8 }}>
        <h2>Wallet State</h2>
        <p>Status: {status}</p>
        {error ? <p style={{ color: 'crimson' }}>Error: {error}</p> : null}
        {isConnected ? <p>Connected address: {address}</p> : <p>Wallet not connected</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={login}>Login with WaaP</button>
          <button onClick={logout}>Logout</button>
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
