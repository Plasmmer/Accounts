'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { assertWaaPConfig } from './waap.config';
import { connectWaaP, disconnectWaaP, fetchAccountBootstrap } from '../lib/identity';

type AuthIntent = 'signin' | 'signup';

type WaaPContextValue = {
  isConnected: boolean;
  address: string | null;
  status: 'idle' | 'connecting' | 'connected' | 'error';
  error: string | null;
  intent: AuthIntent;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  logout: () => Promise<void>;
  refreshBootstrap: () => Promise<void>;
};

const WaaPContext = createContext<WaaPContextValue | undefined>(undefined);

export function WaaPProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<WaaPContextValue['status']>('idle');
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<AuthIntent>('signin');

  async function completeAuth(nextIntent: AuthIntent) {
    try {
      setStatus('connecting');
      setError(null);
      setIntent(nextIntent);
      assertWaaPConfig();

      const accounts = await connectWaaP(nextIntent);
      const primaryAddress = accounts[0] ?? null;

      setAddress(primaryAddress);
      setIsConnected(Boolean(primaryAddress));
      setStatus(primaryAddress ? 'connected' : 'idle');
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'WaaP authentication failed');
    }
  }

  async function signIn() {
    await completeAuth('signin');
  }

  async function signUp() {
    await completeAuth('signup');
  }

  async function refreshBootstrap() {
    try {
      const bootstrap = await fetchAccountBootstrap();
      setAddress(bootstrap.address);
      setIsConnected(Boolean(bootstrap.address));
      setStatus(bootstrap.address ? 'connected' : 'idle');
      setError(null);
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Account bootstrap failed');
    }
  }

  async function logout() {
    try {
      await disconnectWaaP();
    } finally {
      setIsConnected(false);
      setAddress(null);
      setStatus('idle');
      setError(null);
    }
  }

  const value = useMemo(
    () => ({ isConnected, address, status, error, intent, signIn, signUp, logout, refreshBootstrap }),
    [isConnected, address, status, error, intent],
  );

  return <WaaPContext.Provider value={value}>{children}</WaaPContext.Provider>;
}

export function useWaaP() {
  const ctx = useContext(WaaPContext);
  if (!ctx) throw new Error('useWaaP must be used inside WaaPProvider');
  return ctx;
}
