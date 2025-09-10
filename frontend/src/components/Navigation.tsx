import React, { useRef } from 'react';
import PolkadotAuth from './PolkadotAuth';

interface NavigationProps {
  currentPage: 'home' | 'dashboard';
  onPageChange: (page: 'home' | 'dashboard') => void;
  walletAddress: string | null;
  walletName: string | null;
  onWalletConnect: (address: string, accountName: string, session: any) => void;
  onWalletDisconnect: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage, 
  onPageChange, 
  walletAddress, 
  walletName,
  onWalletConnect, 
  onWalletDisconnect 
}) => {
  const [signOutFn, setSignOutFn] = React.useState<(() => Promise<void>) | null>(null);

  const handleSignOutReady = (fn: () => Promise<void>) => {
    setSignOutFn(fn);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    try {
      if (signOutFn && typeof signOutFn === 'function') {
        await signOutFn();
      }
    } catch (err) {
      console.error('Navigation - Error during signOutFn:', err);
    }
    
    onWalletDisconnect();
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => onPageChange('home')}>
          <span className="brand-text">TokenyDemoDApp</span>
        </div>
        
        <div className="nav-right">
          {/* Wallet Status */}
          <div className="wallet-status">
            {walletAddress ? (
              <div className="wallet-connected">
                <span className="wallet-address">
                  {walletName && walletName !== 'Unnamed Account' ? walletName : formatAddress(walletAddress)}
                </span>
                <button 
                  className="nav-item disconnect-btn"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="wallet-disconnected">
                <PolkadotAuth 
                  onConnect={onWalletConnect}
                  onDisconnect={onWalletDisconnect}
                  hideConnectedState={true}
                  onSignOutReady={handleSignOutReady}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
