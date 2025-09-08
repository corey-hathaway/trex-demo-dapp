'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPolkadotAuth } from '@polkadot-auth/core';
import { PolkadotAuthProvider, PolkadotSignInButton, usePolkadotAuth } from '@polkadot-auth/ui';
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';

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
  const { signIn, signOut } = authContext;
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);

  useEffect(() => {
    console.log('PolkadotAuth - Connection state changed:', { isConnected, address, accountName });
    if (isConnected && address && onConnect) {
      // Use accountName if available, otherwise use a formatted address as fallback
      const displayName = accountName || `Account ${address.slice(0, 6)}...${address.slice(-4)}`;
      console.log('PolkadotAuth - Calling onConnect with:', { address, accountName: displayName });
      onConnect(address, displayName, { account: { address, meta: { name: accountName } } });
    }
  }, [isConnected, address, accountName, onConnect]);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        const extensions = await web3Enable('T-REX Demo dApp');
        if (extensions.length === 0) return;

        const accounts = await web3Accounts();
        if (accounts.length > 0 && !isConnected) {
          const account = accounts[0];
          const realAccountName = account.meta.name || `Account ${account.address.slice(0, 6)}...${account.address.slice(-4)}`;
          
          // Set local state
          setAddress(account.address);
          setAccountName(realAccountName);
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error checking existing connection:', err);
      }
    };

    checkExistingConnection();
  }, [onConnect, isConnected]);

  useEffect(() => {
    if (onSignOutReady) {
      onSignOutReady(handleSignOut);
    }
  }, [onSignOutReady, handleSignOut]);

  const handleSignIn = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Use real Polkadot.js Extension instead of mock signIn
      const extensions = await web3Enable('T-REX Demo dApp');
      if (extensions.length === 0) {
        throw new Error('No Polkadot.js Extension found. Please install the extension.');
      }

      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in the Polkadot.js Extension.');
      }

      // Use the first account
      const account = accounts[0];
      const realAccountName = account.meta.name || `Account ${account.address.slice(0, 6)}...${account.address.slice(-4)}`;
      
      // Set local state
      setAddress(account.address);
      setAccountName(realAccountName);
      setIsConnected(true);
      
      // Call the polkadot-sso signIn to maintain the session structure
      await signIn();
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = useCallback(async () => {
    console.log('Disconnect button clicked - starting sign out process');
    try {
      // Call polkadot-sso signOut
      console.log('Calling polkadot-sso signOut...');
      await signOut();
      console.log('Polkadot-sso signOut completed');
      
      // Clear local state
      console.log('Clearing local state...');
      setAddress(null);
      setAccountName(null);
      setIsConnected(false);
      console.log('Local state cleared');
      
      // Only call onDisconnect if we're not hiding the connected state
      // (i.e., if we're showing our own disconnect button)
      if (onDisconnect && !hideConnectedState) {
        console.log('Calling onDisconnect callback...');
        onDisconnect();
        console.log('onDisconnect callback completed');
      } else {
        console.log('Not calling onDisconnect - hideConnectedState is true or no callback provided');
      }
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  }, [signOut, onDisconnect, hideConnectedState]);

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
    <PolkadotAuthProvider config={auth}>
      <PolkadotAuthInner {...props} />
    </PolkadotAuthProvider>
  );
};

export default PolkadotAuth;
