import React from 'react';
import { usePolkadotAuth } from '@polkadot-auth/ui';

interface WalletSelectorProps {
  onConnect: (address: string, accountName: string, session: any) => void;
  onDisconnect: () => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ onConnect, onDisconnect }) => {
  const { signIn, isLoading, error } = usePolkadotAuth();

  const availableWallets = [
    { id: 'nova', name: 'Nova Wallet', icon: '🟠', description: 'Mobile-first Polkadot wallet' },
    { id: 'polkadot-js', name: 'Polkadot.js', icon: '🔴', description: 'Browser extension wallet' },
    { id: 'talisman', name: 'Talisman', icon: '🟣', description: 'Multi-chain wallet' },
    { id: 'subwallet', name: 'SubWallet', icon: '🔵', description: 'Universal wallet' }
  ];

  const handleWalletSelect = async (walletId: string) => {
    try {
      console.log('WalletSelector - Attempting to connect to wallet:', walletId);
      console.log('WalletSelector - Available signIn function:', signIn);
      
      if (signIn && typeof signIn === 'function') {
        const result = await signIn(walletId);
        console.log('WalletSelector - Wallet connection result:', result);
        
        // The onConnect callback will be handled by the parent component
        // when the connection state changes
      } else {
        throw new Error('SignIn function not available');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };

  return (
    <div className="wallet-selector">
      <div className="wallet-grid">
        {availableWallets.map(wallet => (
          <button
            key={wallet.id}
            onClick={() => handleWalletSelect(wallet.id)}
            disabled={isLoading}
            className="wallet-option"
          >
            <div className="wallet-icon">{wallet.icon}</div>
            <div className="wallet-info">
              <div className="wallet-name">{wallet.name}</div>
              <div className="wallet-description">{wallet.description}</div>
            </div>
            {isLoading && (
              <div className="wallet-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="wallet-error">
          <p>❌ {error}</p>
        </div>
      )}
    </div>
  );
};

export default WalletSelector;
