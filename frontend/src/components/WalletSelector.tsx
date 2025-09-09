import React, { useState } from 'react';
import QRCode from 'qrcode';

interface WalletSelectorProps {
  onConnect: (address: string, accountName: string, session: unknown) => void;
  onDisconnect: () => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ onConnect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNovaQr, setShowNovaQr] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const availableWallets = [
    { id: 'polkadot-js', name: 'Polkadot.js', icon: '🔴', description: 'Browser extension wallet' },
    { id: 'talisman', name: 'Talisman', icon: '🟣', description: 'Multi-chain wallet' },
    { id: 'subwallet', name: 'SubWallet', icon: '🔵', description: 'Universal wallet' }
  ];

  const handleWalletSelect = async (walletId: string) => {
    try {
      console.log('WalletSelector - Attempting to connect to wallet:', walletId);
      setIsLoading(true);
      setError(null);
      
      // Mock wallet connection for now
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

  const handleNovaWalletConnect = async () => {
    try {
      // Generate a simple QR code for Nova Wallet
      const authUrl = `nova://auth?challenge=${Date.now()}&app=T-REX Demo`;
      const qrUrl = await QRCode.toDataURL(authUrl);
      setQrCodeUrl(qrUrl);
      setShowNovaQr(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleNovaWalletSuccess = (address: string, session: unknown) => {
    console.log('WalletSelector - Nova Wallet connected successfully:', { address, session });
    setShowNovaQr(false);
    onConnect(address, 'Nova Wallet', session);
  };

  const handleNovaWalletCancel = () => {
    setShowNovaQr(false);
    setQrCodeUrl('');
  };

  return (
    <div className="wallet-selector">
      {/* Nova Wallet Section with QR Code */}
      <div className="nova-wallet-section">
        <h3 className="nova-wallet-title">🟠 Nova Wallet (Mobile)</h3>
        <p className="nova-wallet-description">
          Connect using QR code for mobile authentication
        </p>
        <button
          onClick={handleNovaWalletConnect}
          className="nova-wallet-button"
        >
          🟠 Connect Nova Wallet
        </button>
      </div>

      {/* Divider */}
      <div className="wallet-divider">
        <span>or connect with browser extension</span>
      </div>

      {/* Browser Extension Wallets */}
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

      <div className="wallet-note">
        <p>💡 <strong>Note:</strong> Nova Wallet uses QR code authentication for mobile devices. Browser extension wallets work directly in your browser.</p>
      </div>

      {error && (
        <div className="wallet-error">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Nova Wallet QR Code Modal */}
      {showNovaQr && (
        <div className="nova-qr-modal-overlay">
          <div className="nova-qr-modal">
            <div className="nova-qr-modal-header">
              <h3>🟠 Nova Wallet Authentication</h3>
              <button onClick={handleNovaWalletCancel} className="nova-qr-modal-close">
                ✕
              </button>
            </div>
            <div className="nova-qr-modal-content">
              <div className="nova-qr-code-container">
                <img src={qrCodeUrl} alt="Nova Wallet QR Code" className="nova-qr-code" />
              </div>
              <div className="nova-qr-instructions">
                <h4>How to connect:</h4>
                <ol>
                  <li>Open Nova Wallet on your mobile device</li>
                  <li>Tap the "Scan" button in the app</li>
                  <li>Point your camera at this QR code</li>
                  <li>Review and approve the authentication request</li>
                </ol>
              </div>
              <div className="nova-qr-actions">
                <button onClick={handleNovaWalletCancel} className="nova-qr-cancel-btn">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Mock success for now
                    handleNovaWalletSuccess('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', {
                      id: `session_${Date.now()}`,
                      address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                      walletType: 'nova-wallet'
                    });
                  }} 
                  className="nova-qr-success-btn"
                >
                  Mock Success (for testing)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSelector;
