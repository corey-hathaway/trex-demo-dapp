'use client';

import React from 'react';
import { useConnect, useAccount, useSwitchChain, useDisconnect } from 'wagmi';
import { metaMask } from '@wagmi/connectors';

const WalletConnect = ({ onConnect }: { onConnect?: (address: string) => void }) => {
  // Wagmi hooks for wallet connection
  const { connect, isPending: isConnecting, error: connectError } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { disconnect } = useDisconnect();

  // Target chain ID from your wagmi config
  const targetChainId = 420420420;

  // Handle wallet connection
  const handleConnect = () => {
    console.log('Attempting to connect wallet...');
    try {
      connect({ connector: metaMask() });
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  // Handle network switching
  const handleSwitchNetwork = () => {
    if (chainId !== targetChainId) {
      switchChain({ chainId: targetChainId });
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
  };

  // Call onConnect callback when wallet connects
  React.useEffect(() => {
    if (isConnected && address && onConnect) {
      onConnect(address);
    }
  }, [isConnected, address, onConnect]);

  // Debug logging
  React.useEffect(() => {
    console.log('Wallet state:', { isConnected, address, chainId, connectError });
  }, [isConnected, address, chainId, connectError]);

  return (
    <div className="wallet-connect-container">
      {connectError && (
        <div className="wallet-error">
          <p>{connectError.message || 'Failed to connect wallet'}</p>
          <p className="error-help">
            Make sure you have MetaMask installed and try again.
          </p>
        </div>
      )}

      {!isConnected ? (
        <div className="wallet-connect-section">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="btn-primary wallet-connect-btn"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          <p className="wallet-help">
            Connect your MetaMask wallet to deploy contracts
          </p>
        </div>
      ) : (
        <div className="wallet-connected">
          <div className="wallet-address">
            <span className="address-label">Connected:</span>
            <span className="address-value">
              {`${address?.substring(0, 6)}...${address?.substring(38)}`}
            </span>
          </div>
          
          <div className="wallet-actions">
            {chainId !== targetChainId && (
              <button
                onClick={handleSwitchNetwork}
                disabled={isSwitching}
                className="btn-secondary wallet-switch-btn"
              >
                {isSwitching ? 'Switching...' : `Switch to Chain ${targetChainId}`}
              </button>
            )}
            <button
              onClick={handleDisconnect}
              className="btn-secondary wallet-disconnect-btn"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;