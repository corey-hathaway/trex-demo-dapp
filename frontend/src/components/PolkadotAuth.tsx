'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  console.log('PolkadotAuth - Full authContext:', JSON.stringify(authContext, null, 2));
  
  // Use the correct properties from the polkadot-sso hook
  const { signIn, signOut, isConnected, address, session, isLoading, error } = authContext || {};
  console.log('PolkadotAuth - signIn:', signIn);
  console.log('PolkadotAuth - signOut:', signOut);
  console.log('PolkadotAuth - authContext keys:', Object.keys(authContext || {}));
  console.log('PolkadotAuth - isConnected:', isConnected);
  console.log('PolkadotAuth - address:', address);
  console.log('PolkadotAuth - session:', session);
  console.log('PolkadotAuth - isLoading:', isLoading);
  console.log('PolkadotAuth - error:', error);
  
  // Log all available properties from authContext
  console.log('PolkadotAuth - All authContext keys:', Object.keys(authContext || {}));
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Handle connection state changes
  useEffect(() => {
    console.log('PolkadotAuth - Connection state changed:', { isConnected, address, session });
    console.log('PolkadotAuth - onConnect callback:', onConnect);
    if (isConnected && address && onConnect) {
      // Extract account name from session or use formatted address as fallback
      const accountName = session?.accountName || `Account ${address.slice(0, 6)}...${address.slice(-4)}`;
      console.log('PolkadotAuth - Calling onConnect with:', { address, accountName, session });
      try {
        onConnect(address, accountName, session || { account: { address, meta: { name: accountName } } });
        console.log('PolkadotAuth - onConnect call completed successfully');
      } catch (err) {
        console.error('PolkadotAuth - Error calling onConnect:', err);
      }
    } else {
      console.log('PolkadotAuth - Not calling onConnect because:', { 
        isConnected, 
        hasAddress: !!address, 
        hasOnConnect: !!onConnect 
      });
    }
  }, [isConnected, address, session, onConnect]);

  const handleSignIn = async () => {
    try {
      setIsConnecting(true);
      setLocalError(null);
      
      console.log('PolkadotAuth - Starting real polkadot-sso connection...');
      
      // Use the real polkadot-sso signIn function with Nova wallet support
      if (signIn && typeof signIn === 'function') {
        // Try Nova wallet first, then fallback to polkadot-js
        const result = await signIn('nova-wallet');
        console.log('PolkadotAuth - Real polkadot-sso signIn result:', result);
        
        // Check if the hook updated properly after connection
        setTimeout(() => {
          console.log('PolkadotAuth - Post-connection state check:', { 
            isConnected, 
            address, 
            accountName: session?.accountName || `Account ${address.slice(0, 6)}...${address.slice(-4)}`,
            authContext 
          });
          
          // If the hook didn't update, try to get the connection info directly
          if (!isConnected || !address) {
            console.log('PolkadotAuth - Hook state not updated, checking authContext for connection info...');
            if (authContext && authContext.session) {
              console.log('PolkadotAuth - Found session in authContext:', authContext.session);
              // Try to extract connection info from the session
              if (authContext.session.address && onConnect) {
                const displayName = authContext.session.accountName || `Account ${authContext.session.address.slice(0, 6)}...${authContext.session.address.slice(-4)}`;
                console.log('PolkadotAuth - Calling onConnect with session data:', { address: authContext.session.address, accountName: displayName });
                onConnect(authContext.session.address, displayName, authContext.session);
              }
            }
          }
        }, 1000);
        
        console.log('PolkadotAuth - Real polkadot-sso signIn successful');
      } else {
        console.error('PolkadotAuth - SignIn function not available:', { signIn, authContext });
        throw new Error('SignIn function not available from polkadot-sso. Available functions: ' + Object.keys(authContext || {}).join(', '));
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = useCallback(async () => {
    console.log('PolkadotAuth - handleSignOut called - Using real polkadot-sso signOut');
    
    try {
      // Use the real polkadot-sso signOut function
      if (signOut && typeof signOut === 'function') {
        await signOut();
        console.log('PolkadotAuth - Real polkadot-sso signOut successful');
      } else {
        console.log('PolkadotAuth - SignOut function not available, calling onDisconnect directly');
        if (onDisconnect) {
          onDisconnect();
        }
      }
    } catch (err) {
      console.error('SignOut error:', err);
      // Fallback to calling onDisconnect directly
      if (onDisconnect) {
        onDisconnect();
      }
    }
  }, [signOut, onDisconnect]);

  useEffect(() => {
    console.log('PolkadotAuth - onSignOutReady useEffect triggered');
    console.log('PolkadotAuth - onSignOutReady:', onSignOutReady);
    console.log('PolkadotAuth - handleSignOut:', handleSignOut);
    if (onSignOutReady) {
      console.log('PolkadotAuth - Calling onSignOutReady with handleSignOut...');
      onSignOutReady(handleSignOut);
      console.log('PolkadotAuth - onSignOutReady call completed');
    } else {
      console.log('PolkadotAuth - No onSignOutReady callback provided');
    }
  }, [onSignOutReady, handleSignOut]);

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
      <WalletSelector 
        onConnect={onConnect || (() => {})}
        onDisconnect={onDisconnect || (() => {})}
      />
      
      {(error || localError) && (
        <div className="text-red-500 text-sm text-center">
          {error || localError}
        </div>
      )}
    </div>
  );
};

const PolkadotAuth: React.FC<PolkadotAuthProps> = (props) => {
  return <PolkadotAuthInner {...props} />;
};

export default PolkadotAuth;
