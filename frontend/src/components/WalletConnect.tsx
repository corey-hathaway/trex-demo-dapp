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
    connect({ connector: metaMask() });
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

  return (
    <div className="border border-pink-500 rounded-lg p-4 shadow-md bg-white text-pink-500 max-w-sm mx-auto">
      {connectError && (
        <p className="text-red-500 text-sm mb-2">
          {connectError.message || 'Failed to connect wallet'}
        </p>
      )}

      {!isConnected ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-sm font-mono bg-pink-100 px-2 py-1 rounded-md text-pink-700">
            {`${address?.substring(0, 6)}...${address?.substring(38)}`}
          </span>
          <button
            onClick={handleDisconnect}
            className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-pink-500 py-2 px-4 rounded-lg transition"
          >
            Disconnect
          </button>
          {chainId !== targetChainId && (
            <button
              onClick={handleSwitchNetwork}
              disabled={isSwitching}
              className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {isSwitching ? 'Switching...' : `Switch to Chain ${targetChainId}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;