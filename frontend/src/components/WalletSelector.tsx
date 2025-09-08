import React from 'react';
import { usePolkadotAuth } from '@polkadot-auth/ui';

const WalletSelector = () => {
  const { connect, isLoading, error } = usePolkadotAuth();

  const availableWallets = [
    { name: 'polkadot-js', displayName: 'Polkadot.js', icon: '🔴' },
    { name: 'talisman', displayName: 'Talisman', icon: '🟣' },
    { name: 'subwallet', displayName: 'SubWallet', icon: '🔵' },
    { name: 'nova-wallet', displayName: 'Nova Wallet', icon: '🟠' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">
        Connect Your Wallet
      </h3>
      <p className="text-gray-400 text-sm mb-6 text-center">
        Choose from {availableWallets.length} available wallets to deploy T-REX tokens
      </p>

      <div className="space-y-3">
        {availableWallets.map(wallet => (
          <button
            key={wallet.name}
            onClick={() => connect(wallet.name)}
            disabled={isLoading}
            className="w-full flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          >
            <span className="text-2xl">{wallet.icon}</span>
            <span className="font-medium">{wallet.displayName}</span>
            {isLoading && (
              <div className="ml-auto">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
          <p className="text-red-400 text-sm">❌ {error.message}</p>
        </div>
      )}
    </div>
  );
};

export default WalletSelector;
