import React, { useState } from 'react';
import { MintSection } from './MintSection';
import { TransferSection } from './TransferSection';
import { YourTokensSection } from './YourTokensSection';
import { TransactionsSection } from './TransactionsSection';
import WalletConnect from './WalletConnect';

interface Token {
  name: string;
  symbol: string;
  supply: string;
  value: string;
  address: string;
}

interface Transaction {
  type: string;
  amount: string;
  symbol: string;
  recipient: string;
  timestamp: string;
  hash: string;
}

export const NewHomepage: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleDeployToken = (tokenData: { name: string; symbol: string; supply: string }) => {
    const newToken: Token = {
      name: tokenData.name,
      symbol: tokenData.symbol,
      supply: tokenData.supply,
      value: `$${(parseInt(tokenData.supply) * 1000).toLocaleString()}`, // Mock value calculation
      address: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
    };
    
    setTokens(prev => [newToken, ...prev]);
    
    // Add mint transaction
    const mintTransaction: Transaction = {
      type: 'Mint',
      amount: tokenData.supply,
      symbol: tokenData.symbol,
      recipient: 'New Token',
      timestamp: 'Just now',
      hash: `0x${Math.random().toString(16).substr(2, 8)}...`
    };
    
    setTransactions(prev => [mintTransaction, ...prev]);
  };

  const handleTransfer = (transferData: { tokenAddress: string; recipient: string; amount: string }) => {
    // Find the token being transferred
    const token = tokens.find(t => t.address === transferData.tokenAddress);
    if (!token) return;

    // Add transfer transaction
    const transferTransaction: Transaction = {
      type: 'Transfer',
      amount: transferData.amount,
      symbol: token.symbol,
      recipient: transferData.recipient,
      timestamp: 'Just now',
      hash: `0x${Math.random().toString(16).substr(2, 8)}...`
    };
    
    setTransactions(prev => [transferTransaction, ...prev]);
  };

  const handleViewToken = (token: Token) => {
    console.log('Viewing token:', token);
    // This could navigate to a detailed token view
  };

  const handleViewAllTokens = () => {
    console.log('Viewing all tokens');
    // This could open a modal or navigate to a full tokens list
  };

  const handleViewAllTransactions = () => {
    console.log('Viewing all transactions');
    // This could open a modal or navigate to a full transactions list
  };

  const handleWalletConnect = (address: string) => {
    console.log('Wallet connected:', address);
  };

  return (
    <div className="new-homepage">
      {/* Wallet Connection - positioned in top right */}
      <div className="wallet-connection-top">
        <WalletConnect onConnect={handleWalletConnect} />
      </div>

      {/* Main Content Grid */}
      <div className="homepage-grid">
        <div className="grid-item">
          <MintSection onDeployToken={handleDeployToken} />
        </div>
        
        <div className="grid-item">
          <TransferSection tokens={tokens} onTransfer={handleTransfer} />
        </div>
        
        <div className="grid-item">
          <YourTokensSection 
            tokens={tokens} 
            onViewToken={handleViewToken}
            onViewAll={handleViewAllTokens}
          />
        </div>
        
        <div className="grid-item">
          <TransactionsSection 
            transactions={transactions}
            onViewAll={handleViewAllTransactions}
          />
        </div>
      </div>
    </div>
  );
};
