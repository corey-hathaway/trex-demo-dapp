import React from 'react';
import { usePolkadotAuth } from '@polkadot-auth/ui';
import WalletSelector from './WalletSelector';

const Dashboard = () => {
  const { isConnected, address, session } = usePolkadotAuth();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">T-REX Asset Dashboard</h2>
        <p className="text-gray-400 mb-8">
          Connect your wallet to view and manage your deployed tokens
        </p>
        <WalletSelector />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to T-REX Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Connected Wallet</h3>
            <p className="font-mono text-sm text-blue-400">{address}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Session ID</h3>
            <p className="font-mono text-sm text-green-400">{session?.id}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <p className="text-green-400">✅ Authenticated</p>
          </div>
        </div>
      </div>

      {/* Your existing T-REX dashboard content */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Deployed Tokens</h3>
        <p className="text-gray-400">
          Your deployed ERC-3643 tokens will appear here...
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
