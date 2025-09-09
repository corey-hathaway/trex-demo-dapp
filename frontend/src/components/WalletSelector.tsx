import React, { useState } from 'react';
import { NovaWalletSignInButton, NovaQrAuth } from '@polkadot-auth/ui';
import { createNovaQrAuthService, NovaQrAuthData } from '@polkadot-auth/client-sdk';

interface WalletSelectorProps {
  onConnect: (address: string, accountName: string, session: unknown) => void;
  onDisconnect: () => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ onConnect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaQrData, setNovaQrData] = useState<NovaQrAuthData | null>(null);
  const [showNovaQr, setShowNovaQr] = useState(false);
  const [novaAuthService] = useState(() =>
    createNovaQrAuthService({
      baseUrl: 'http://localhost:3001', // Backend URL
      timeout: 300000, // 5 minutes
      pollInterval: 2000 // 2 seconds
    })
  );

  const availableWallets = [
    { id: 'polkadot-js', name: 'Polkadot.js', icon: '🔴', description: 'Browser extension wallet' },
    { id: 'nova-wallet', name: 'Nova Wallet', icon: '🟠', description: 'Mobile wallet with QR authentication' }
  ];

  const handleWalletSelect = async (walletId: string) => {
    try {
      console.log('WalletSelector - Attempting to connect to wallet:', walletId);
      setIsLoading(true);
      setError(null);
      
      if (walletId === 'nova-wallet') {
        // Handle Nova Wallet - this will trigger the QR code flow
        return;
      }
      
      // Mock wallet connection for Polkadot.js for now
      setTimeout(() => {
        const mockAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
        const mockSession = {
          id: `session_${Date.now()}`,
          address: mockAddress,
          walletType: walletId
        };
        
        onConnect(mockAddress, walletId, mockSession);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsLoading(false);
    }
  };

  const handleNovaWalletSuccess = (address: string, session: unknown) => {
    console.log('WalletSelector - Nova Wallet connected successfully:', { address, session });
    setShowNovaQr(false);
    setNovaQrData(null);
    onConnect(address, 'Nova Wallet', session);
  };

  const handleNovaWalletError = (error: Error) => {
    console.error('Nova Wallet authentication error:', error);
    setError(error.message);
    setShowNovaQr(false);
    setNovaQrData(null);
  };

  const handleNovaWalletCancel = () => {
    setShowNovaQr(false);
    setNovaQrData(null);
  };

  const handleNovaQrWaitForCompletion = async () => {
    if (novaQrData) {
      try {
        const result = await novaAuthService.waitForCompletion(novaQrData.authId);
        if (result.success) {
          handleNovaWalletSuccess(result.address, result.session);
        } else {
          handleNovaWalletError(new Error(result.error || 'Authentication failed'));
        }
      } catch (error) {
        handleNovaWalletError(error as Error);
      }
    }
  };

  return (
    <div className="wallet-selector">
      <div className="wallet-selector-header">
        <h3>Connect Your Wallet</h3>
        <p>Choose how you'd like to connect to the T-REX Demo dApp</p>
      </div>

      {/* Wallet Options Grid */}
      <div className="wallet-grid">
        {availableWallets.map(wallet => (
          <div key={wallet.id} className="wallet-option-card">
            <div className="wallet-icon">{wallet.icon}</div>
            <div className="wallet-info">
              <div className="wallet-name">{wallet.name}</div>
              <div className="wallet-description">{wallet.description}</div>
            </div>
            {wallet.id === 'nova-wallet' ? (
              <NovaWalletSignInButton
                onSuccess={handleNovaWalletSuccess}
                onError={handleNovaWalletError}
                baseUrl="http://localhost:3001"
                className="wallet-connect-button nova-wallet-button"
              >
                Connect
              </NovaWalletSignInButton>
            ) : (
              <button
                onClick={() => handleWalletSelect(wallet.id)}
                disabled={isLoading}
                className="wallet-connect-button polkadot-js-button"
              >
                {isLoading ? 'Connecting...' : 'Connect'}
              </button>
            )}
            {isLoading && wallet.id !== 'nova-wallet' && (
              <div className="wallet-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="wallet-error">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Nova Wallet QR Code Modal */}
      {showNovaQr && novaQrData && (
        <NovaQrAuth
          qrData={novaQrData}
          onSuccess={handleNovaWalletSuccess}
          onError={handleNovaWalletError}
          onCancel={handleNovaWalletCancel}
          waitForCompletion={handleNovaQrWaitForCompletion}
          className="nova-qr-modal"
        />
      )}
    </div>
  );
};

export default WalletSelector;
