import React, { useState, useEffect } from 'react';
import { NovaWalletSignInButton, NovaQrAuth } from '@polkadot-auth/ui';
import { createNovaQrAuthService, NovaQrAuthData } from '@polkadot-auth/client-sdk';
import QRCode from 'qrcode';
import PapiLogin from './PapiLogin';

// TypeScript declaration for injectedWeb3
declare global {
  interface Window {
    injectedWeb3?: {
      [key: string]: {
        enable: (origin: string) => Promise<{
          accounts: {
            get: () => Promise<Array<{
              address: string;
              meta: {
                name?: string;
                source: string;
              };
            }>>;
          };
        }>;
      };
    };
  }
}

interface WalletSelectorProps {
  onConnect: (address: string, accountName: string, session: unknown) => void;
  onDisconnect: () => void;
  authContext?: any;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ onConnect, authContext }) => {
  const { connect, disconnect, isConnected, address, session, isLoading, error } = authContext || {};
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [novaQrData, setNovaQrData] = useState<NovaQrAuthData | null>(null);
  const [showNovaQr, setShowNovaQr] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrTimer, setQrTimer] = useState<number>(300); // 5 minutes
  const [showPapiLogin, setShowPapiLogin] = useState(false);
  const [novaAuthService] = useState(() =>
    createNovaQrAuthService({
      baseUrl: 'http://localhost:3001', // Backend URL
      timeout: 300000, // 5 minutes
      pollInterval: 2000 // 2 seconds
    })
  );

  // Timer effect for QR code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showNovaQr && qrTimer > 0) {
      interval = setInterval(() => {
        setQrTimer(prev => {
          if (prev <= 1) {
            setShowNovaQr(false);
            setQrCodeUrl('');
            setQrTimer(300);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showNovaQr, qrTimer]);

  // Simple wallet options using polkadot-sso
  const availableWallets = [
    { id: 'polkadot-js', name: 'Polkadot.js', description: 'Official Polkadot extension' },
    { id: 'nova-wallet', name: 'Nova Wallet', description: 'Mobile wallet with QR authentication' },
    { id: 'papi', name: 'PAPI Login', description: 'Direct blockchain authentication' }
  ];

  const handleWalletSelect = async (walletId: string) => {
    console.log('🔌 Wallet selected:', walletId);
    console.log('🔌 Auth context:', authContext);
    console.log('🔌 Available functions:', Object.keys(authContext || {}));
    console.log('🔌 connect function:', connect);
    console.log('🔌 connect type:', typeof connect);
    console.log('🔌 connect available:', !!connect);
    console.log('🔌 connect is function:', typeof connect === 'function');
    
    try {
      setIsConnecting(true);
      setLocalError(null);
      
      if (walletId === 'nova-wallet') {
        // Handle Nova Wallet - show QR code
        await handleNovaWalletConnect();
        setIsConnecting(false);
        return;
      }
      
      if (walletId === 'papi') {
        // Handle PAPI login - show PAPI login form
        setShowPapiLogin(true);
        setIsConnecting(false);
        return;
      }
      
      // Use polkadot-sso for other wallets
      if (connect && typeof connect === 'function') {
        console.log('🔌 Using polkadot-sso connect for:', walletId);
        const result = await connect(walletId);
        console.log('🔌 Connect result:', result);
        
        // The polkadot-sso system will handle the connection
        // and the usePolkadotAuth hook will update the state
        setIsConnecting(false);
        return;
      } else {
        console.log('❌ connect not available. Available functions:', Object.keys(authContext || {}));
        throw new Error('Connect function not available from polkadot-sso. Available functions: ' + Object.keys(authContext || {}).join(', '));
      }
      
    } catch (err) {
      console.error('Wallet connection error:', err);
      setLocalError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnecting(false);
    }
  };

  const handleNovaWalletConnect = async () => {
    try {
      // Reset timer
      setQrTimer(300);
      setIsConnecting(true);
      setLocalError(null);
      
      // Use the proper Nova Wallet authentication flow
      const adapter = new (await import('@polkadot-auth/client-sdk')).NovaWalletAdapter();
      
      // Set up QR authentication service
      const qrAuthService = createNovaQrAuthService({ baseUrl: 'http://localhost:3001' });
      adapter.setQrAuthService(qrAuthService);
      
      // Generate challenge
      const challengeId = `challenge_${Date.now()}`;
      const message = `Sign this message to authenticate with Nova Wallet\n\nChallenge ID: ${challengeId}\nTimestamp: ${new Date().toISOString()}`;
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Mock address for QR generation
      
      console.log('🔌 Nova Wallet - Starting QR authentication flow');
      
      const { qrData: qrAuthData, waitForCompletion: waitFn } = await adapter.connectWithQr(
        challengeId,
        message,
        address
      );
      
      console.log('🔌 Nova Wallet - QR data generated:', qrAuthData);
      
      // Show QR modal on main screen only (no popup window)
      setNovaQrData(qrAuthData);
      setShowNovaQr(true);
      
      setIsConnecting(false);
    } catch (error) {
      console.error('Nova Wallet connection error:', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to connect to Nova Wallet');
      setIsConnecting(false);
    }
  };

  const handleNovaWalletSuccess = (address: string, session: unknown) => {
    console.log('WalletSelector - Nova Wallet connected successfully:', { address, session });
    setShowNovaQr(false);
    setQrCodeUrl('');
    setNovaQrData(null);
    onConnect(address, 'Nova Wallet', session);
  };

  const handleNovaWalletError = (error: Error) => {
    console.error('Nova Wallet authentication error:', error);
    setError(error.message);
    setShowNovaQr(false);
    setQrCodeUrl('');
    setNovaQrData(null);
  };

  const handleNovaWalletCancel = () => {
    setShowNovaQr(false);
    setQrCodeUrl('');
    setNovaQrData(null);
    setQrTimer(300);
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
            <div className="wallet-info">
              <div className="wallet-name">{wallet.name}</div>
              <div className="wallet-description">{wallet.description}</div>
            </div>
            <button
              onClick={() => handleWalletSelect(wallet.id)}
              disabled={isConnecting}
              className="wallet-connect-button"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
            {isConnecting && wallet.id !== 'nova-wallet' && (
              <div className="wallet-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {(error || localError) && (
        <div className="wallet-error">
          <p>❌ {error || localError}</p>
        </div>
      )}

      {/* Nova Wallet QR Code Modal - Compact */}
      {showNovaQr && novaQrData && (
        <div className="nova-qr-modal-overlay">
          <div className="nova-qr-modal">
            <div className="nova-qr-modal-content">
              <div className="nova-qr-code-container">
                <img 
                  src={novaQrData.qrCodeDataUrl} 
                  alt="Nova Wallet QR Code" 
                  className="nova-qr-code" 
                />
              </div>
              <div className="nova-qr-timer">
                {Math.floor(qrTimer / 60)}:{(qrTimer % 60).toString().padStart(2, '0')}
              </div>
              <button onClick={handleNovaWalletCancel} className="nova-qr-close-btn">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}


      {/* PAPI Login Modal */}
      {showPapiLogin && (
        <div className="papi-modal-overlay">
          <div className="papi-modal">
            <div className="papi-modal-header">
              <h3>🔗 PAPI Login</h3>
              <button 
                onClick={() => setShowPapiLogin(false)} 
                className="papi-modal-close"
              >
                ×
              </button>
            </div>
            <div className="papi-modal-content">
              <PapiLogin onLogin={onConnect} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSelector;
