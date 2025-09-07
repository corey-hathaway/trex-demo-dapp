'use client';

import React, { useState, useEffect } from 'react';
import { createPolkadotAuth } from '@polkadot-auth/core';
import { PolkadotAuthProvider, PolkadotSignInButton, usePolkadotAuth } from '@polkadot-auth/ui';

// Type aliases for better readability
type WalletProvider = any;
type WalletConnection = any;
type Session = any;
type PolkadotAuthInstance = any;
type AuthResult = any;

interface PolkadotAuthProps {
  onConnect?: (address: string, accountName: string, session: Session) => void;
  onDisconnect?: () => void;
  hideConnectedState?: boolean; // New prop to hide the connected state UI
  onSignOutReady?: (signOutFn: () => Promise<void>) => void; // Callback to expose signOut function
}

const PolkadotAuthInner: React.FC<PolkadotAuthProps> = ({ onConnect, onDisconnect, hideConnectedState = false, onSignOutReady }) => {
  const authContext = usePolkadotAuth() as any;
  const { isConnected, address, accountName, session, signIn, signOut } = authContext;
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address && accountName && session && onConnect) {
      onConnect(address, accountName, session);
    }
  }, [isConnected, address, accountName, session, onConnect]);

  useEffect(() => {
    if (onSignOutReady) {
      onSignOutReady(handleSignOut);
    }
  }, [onSignOutReady]);

  const handleSignIn = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await signIn();
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      if (onDisconnect) {
        onDisconnect();
      }
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  };

  if (isConnected && address && !hideConnectedState) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-gray-600">Connected:</span>
          <span className="ml-2 font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // If connected but hideConnectedState is true, return null to let parent handle the UI
  if (isConnected && address && hideConnectedState) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <PolkadotSignInButton
        onSignIn={handleSignIn}
        disabled={isConnecting}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect Polkadot Wallet'}
      </PolkadotSignInButton>
      
      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

const PolkadotAuth: React.FC<PolkadotAuthProps> = (props) => {
  const [auth, setAuth] = useState<PolkadotAuthInstance | null>(null);

  useEffect(() => {
    const polkadotAuth = createPolkadotAuth({
      defaultChain: 'polkadot',
      providers: ['polkadot-js', 'talisman', 'subwallet', 'nova'],
      session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      },
      security: {
        enableNonce: true,
        enableDomainBinding: true,
        enableRequestTracking: true,
        challengeExpiration: 5 * 60, // 5 minutes
      },
    });

    setAuth(polkadotAuth);
  }, []);

  if (!auth) {
    return <div>Loading...</div>;
  }

  return (
    <PolkadotAuthProvider config={{}}>
      <PolkadotAuthInner {...props} />
    </PolkadotAuthProvider>
  );
};

export default PolkadotAuth;
