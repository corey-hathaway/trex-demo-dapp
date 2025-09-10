'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePolkadotAuth } from '@polkadot-auth/ui';
import WalletSelector from './WalletSelector';

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
  
  // Use the correct properties from the polkadot-sso hook
  const { connect, disconnect, isConnected, address, session, isLoading, error } = authContext || {};
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const hasCalledOnSignOutReady = useRef(false);

  // Handle connection state changes
  useEffect(() => {
    if (isConnected && address && onConnect) {
      console.log('🔌 PolkadotAuth - Connection detected:', { isConnected, address, session });
      
      // Extract account name from session or use formatted address as fallback
      const accountName = session?.accountName || `Account ${address.slice(0, 6)}...${address.slice(-4)}`;
      console.log('🔌 PolkadotAuth - Account name:', accountName);
      
      try {
        onConnect(address, accountName, session || { account: { address, meta: { name: accountName } } });
        console.log('🔌 PolkadotAuth - onConnect called with:', { address, accountName });
      } catch (err) {
        console.error('PolkadotAuth - Error calling onConnect:', err);
      }
    }
  }, [isConnected, address, session, onConnect]);

  const handleSignIn = async () => {
    try {
      setIsConnecting(true);
      setLocalError(null);
      
      
      // Use the real polkadot-sso connect function with Nova wallet support
      if (connect && typeof connect === 'function') {
        // Try Nova wallet first, then fallback to polkadot-js
        const result = await connect('nova-wallet');
        
        // Check if the hook updated properly after connection
        setTimeout(() => {
          // If the hook didn't update, try to get the connection info directly
          if (!isConnected || !address) {
            if (authContext && authContext.session) {
              // Try to extract connection info from the session
              if (authContext.session.address && onConnect) {
                const displayName = authContext.session.accountName || `Account ${authContext.session.address.slice(0, 6)}...${authContext.session.address.slice(-4)}`;
                onConnect(authContext.session.address, displayName, authContext.session);
              }
            }
          }
        }, 1000);
      } else {
        throw new Error('Connect function not available from polkadot-sso. Available functions: ' + Object.keys(authContext || {}).join(', '));
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = useCallback(async () => {
    try {
      // Use the real polkadot-sso disconnect function
      if (disconnect && typeof disconnect === 'function') {
        await disconnect();
      } else {
        if (onDisconnect) {
          onDisconnect();
        }
      }
    } catch (err) {
      console.error('Disconnect error:', err);
      // Fallback to calling onDisconnect directly
      if (onDisconnect) {
        onDisconnect();
      }
    }
  }, [disconnect, onDisconnect]);

  useEffect(() => {
    if (onSignOutReady && !hasCalledOnSignOutReady.current) {
      hasCalledOnSignOutReady.current = true;
      onSignOutReady(handleSignOut);
    }
  }, [onSignOutReady]);

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
      <button
        onClick={() => setShowWalletSelector(true)}
        disabled={isConnecting}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      
      {(error || localError) && (
        <div className="text-red-500 text-sm text-center">
          {error || localError}
        </div>
      )}

      {/* Wallet Selector Modal */}
      {showWalletSelector && createPortal(
        <div className="wallet-modal-overlay" onClick={() => setShowWalletSelector(false)}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wallet-modal-header">
              <h3>Choose Your Wallet</h3>
              <button 
                className="wallet-modal-close"
                onClick={() => setShowWalletSelector(false)}
              >
                ×
              </button>
            </div>
            <WalletSelector 
              onConnect={(address, accountName, session) => {
                setShowWalletSelector(false);
                if (onConnect) onConnect(address, accountName, session);
              }}
              onDisconnect={onDisconnect || (() => {})}
              authContext={authContext}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const PolkadotAuth: React.FC<PolkadotAuthProps> = (props) => {
  return <PolkadotAuthInner {...props} />;
};

export default PolkadotAuth;
