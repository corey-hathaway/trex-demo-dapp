import React from 'react';
import { usePolkadotAuth } from '@polkadot-auth/ui';

const Navigation = () => {
  const {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading,
    error
  } = usePolkadotAuth();

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* T-REX Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold">T-REX Demo</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#dashboard" className="hover:text-blue-400 transition-colors">
              Asset Dashboard
            </a>
            <a href="#deploy" className="hover:text-blue-400 transition-colors">
              Deploy Contracts
            </a>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <div className="text-gray-300">Connected</div>
                  <div className="font-mono text-xs">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                </div>
                <button
                  onClick={disconnect}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => connect('polkadot-js')}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
                {error && (
                  <div className="text-red-400 text-xs">
                    {error.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
