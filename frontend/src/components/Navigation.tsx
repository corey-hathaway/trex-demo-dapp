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
  console.log('Navigation - walletAddress:', walletAddress);
  console.log('Navigation - walletName:', walletName);
  const [signOutFn, setSignOutFn] = React.useState<(() => Promise<void>) | null>(null);

  React.useEffect(() => {
    console.log('Navigation - signOutFn state changed:', signOutFn);
    console.log('Navigation - signOutFn type:', typeof signOutFn);
  }, [signOutFn]);

  const handleSignOutReady = (fn: () => Promise<void>) => {
    console.log('Navigation - handleSignOutReady called with:', fn);
    console.log('Navigation - fn type:', typeof fn);
    setSignOutFn(fn);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    console.log('Navigation - handleDisconnect called');
    console.log('Navigation - signOutFn:', signOutFn);
    console.log('Navigation - signOutFn type:', typeof signOutFn);
    
    try {
      if (signOutFn && typeof signOutFn === 'function') {
        console.log('Navigation - Calling signOutFn...');
        await signOutFn();
        console.log('Navigation - signOutFn completed');
      } else {
        console.log('Navigation - No valid signOutFn available, calling onWalletDisconnect directly');
      }
    } catch (err) {
      console.error('Navigation - Error during signOutFn:', err);
    }
    
    console.log('Navigation - Calling onWalletDisconnect...');
    onWalletDisconnect();
    console.log('Navigation - onWalletDisconnect completed');
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
                  {walletName ? walletName : formatAddress(walletAddress)}
                </span>
                <button 
                  className="nav-item disconnect-btn"
                  onClick={() => {
                    console.log('Navigation - Disconnect button clicked');
                    handleDisconnect();
                  }}
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
