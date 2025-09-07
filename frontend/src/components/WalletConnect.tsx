'use client';

import React from 'react';
import PolkadotAuth from './PolkadotAuth';

const WalletConnect = ({ onConnect }: { onConnect?: (address: string) => void }) => {
  const handleWalletConnect = (address: string, session: any) => {
    console.log('Polkadot wallet connected:', address);
    if (onConnect) {
      onConnect(address);
    }
  };

  const handleWalletDisconnect = () => {
    console.log('Polkadot wallet disconnected');
  };

  return (
    <div className="wallet-connect-container">
      <PolkadotAuth 
        onConnect={handleWalletConnect}
        onDisconnect={handleWalletDisconnect}
      />
    </div>
  );
};

export default WalletConnect;