'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { assertWaaPConfig } from './waap.config';

type WaaPContextValue = {
  isConnected: boolean;
  address: string | null;
  status: 'idle' | 'connecting' | 'connected' | 'error';
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const WaaPContext = createContext<WaaPContextValue | undefined>(undefined);

export function WaaPProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<WaaPContextValue['status']>('idle');
  const [error, setError] = useState<string | null>(null);

  async function login() {
    try {
      setStatus('connecting');
      setError(null);
      assertWaaPConfig();

      // TODO: Replace this block with real WaaP SDK calls.
      // Example intent:
      // 1) Initialize WaaP client with config
      // 2) Trigger WaaP auth/login UI flow
      // 3) Retrieve EVM address from provider/session
      const mockedAddress = '0x000000000000000000000000000000000000dEaD';

      setAddress(mockedAddress);
      setIsConnected(true);
      setStatus('connected');
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'WaaP login failed');
    }
  }

  async function logout() {
    // TODO: Replace with WaaP session destroy/disconnect.
    setIsConnected(false);
    setAddress(null);
    setStatus('idle');
    setError(null);
  }

  const value = useMemo(
    () => ({ isConnected, address, status, error, login, logout }),
    [isConnected, address, status, error],
  );

  return <WaaPContext.Provider value={value}>{children}</WaaPContext.Provider>;
}

export function useWaaP() {
  const ctx = useContext(WaaPContext);
  if (!ctx) throw new Error('useWaaP must be used inside WaaPProvider');
  return ctx;
}
