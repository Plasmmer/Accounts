'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  connectWaaP,
  disconnectWaaP,
  fetchAccountBootstrap,
  getWaaPProvider,
  type AccountBootstrapResponse,
} from '../lib/identity';

type WaaPContextValue = {
  isConnected: boolean;
  address: string | null;
  status: 'idle' | 'connecting' | 'connected' | 'error';
  error: string | null;
  bootstrap: AccountBootstrapResponse | null;
  connect: () => Promise<void>;
  logout: () => Promise<void>;
  refreshBootstrap: () => Promise<void>;
};

const WaaPContext = createContext<WaaPContextValue | undefined>(undefined);

export function WaaPProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<WaaPContextValue['status']>('idle');
  const [error, setError] = useState<string | null>(null);
  const [bootstrap, setBootstrap] = useState<AccountBootstrapResponse | null>(null);

  const refreshBootstrap = useCallback(async () => {
    try {
      const account = await fetchAccountBootstrap();
      setBootstrap(account);
      setAddress(account.address);
      setIsConnected(Boolean(account.address));
      setStatus(account.address ? 'connected' : 'idle');
      setError(null);
    } catch (cause) {
      setStatus('error');
      setError(cause instanceof Error ? cause.message : 'Could not load the local account');
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      setStatus('connecting');
      setError(null);

      const accounts = await connectWaaP();
      if (!accounts[0]) {
        setStatus('idle');
        return;
      }

      // Complete the local account bootstrap immediately after WaaP login.
      await refreshBootstrap();
    } catch (cause) {
      setStatus('error');
      setError(cause instanceof Error ? cause.message : 'WaaP authentication failed');
    }
  }, [refreshBootstrap]);

  const logout = useCallback(async () => {
    try {
      await disconnectWaaP();
      setIsConnected(false);
      setAddress(null);
      setBootstrap(null);
      setStatus('idle');
      setError(null);
    } catch (cause) {
      setStatus('error');
      setError(cause instanceof Error ? cause.message : 'WaaP logout failed');
    }
  }, []);

  useEffect(() => {
    let active = true;

    const clearDisconnectedState = () => {
      if (!active) return;
      setIsConnected(false);
      setAddress(null);
      setBootstrap(null);
      setStatus('idle');
    };

    const syncAccounts = () => {
      if (active) void refreshBootstrap();
    };

    let provider: ReturnType<typeof getWaaPProvider> | undefined;

    try {
      provider = getWaaPProvider();
      provider.on?.('accountsChanged', syncAccounts);
      provider.on?.('chainChanged', syncAccounts);
      provider.on?.('connect', syncAccounts);
      provider.on?.('disconnect', clearDisconnectedState);
      void refreshBootstrap();
    } catch (cause) {
      setStatus('error');
      setError(cause instanceof Error ? cause.message : 'WaaP provider initialization failed');
    }

    return () => {
      active = false;
      provider?.removeListener?.('accountsChanged', syncAccounts);
      provider?.removeListener?.('chainChanged', syncAccounts);
      provider?.removeListener?.('connect', syncAccounts);
      provider?.removeListener?.('disconnect', clearDisconnectedState);
    };
  }, [refreshBootstrap]);

  const value = useMemo(
    () => ({ isConnected, address, status, error, bootstrap, connect, logout, refreshBootstrap }),
    [isConnected, address, status, error, bootstrap, connect, logout, refreshBootstrap],
  );

  return <WaaPContext.Provider value={value}>{children}</WaaPContext.Provider>;
}

export function useWaaP() {
  const context = useContext(WaaPContext);
  if (!context) throw new Error('useWaaP must be used inside WaaPProvider');
  return context;
}
