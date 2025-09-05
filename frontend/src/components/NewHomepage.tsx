import React, { useState } from 'react';
import { MintSection } from './MintSection';
import { TransferSection } from './TransferSection';
import { DeployTokenSection } from './DeployTokenSection';
import { YourTokensSection } from './YourTokensSection';
import { TransactionsSection } from './TransactionsSection';
import { ToastContainer } from './ToastContainer';
import WalletConnect from './WalletConnect';
import { useToast } from '../hooks/useToast';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const handleDeployToken = (tokenData: { name: string; symbol: string; supply: string }) => {
    try {
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
      
      showSuccess(`Token "${tokenData.name}" (${tokenData.symbol}) deployed successfully!`);
    } catch (error) {
      showError('Failed to deploy token. Please try again.');
    }
  };

  const handleTransfer = (transferData: { tokenAddress: string; recipient: string; amount: string }) => {
    try {
      // Find the token being transferred
      const token = tokens.find(t => t.address === transferData.tokenAddress);
      if (!token) {
        showError('Token not found. Please select a valid token.');
        return;
      }

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
      
      showSuccess(`Transferred ${transferData.amount} ${token.symbol} to ${transferData.recipient.slice(0, 6)}...`);
    } catch (error) {
      showError('Transfer failed. Please try again.');
    }
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

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = (prev + 1) % 3;
      console.log('Next slide:', newSlide);
      return newSlide;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = (prev - 1 + 3) % 3;
      console.log('Prev slide:', newSlide);
      return newSlide;
    });
  };

  const goToSlide = (index: number) => {
    console.log('Go to slide:', index);
    setCurrentSlide(index);
  };

  return (
    <div className="new-homepage">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Wallet Connection - positioned in top right */}
      <div className="wallet-connection-top">
        <WalletConnect onConnect={handleWalletConnect} />
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>T-REX Deployer</h1>
        <p>Deploy ERC-3643 compliant security tokens on Polkadot with Tokeny's regulatory framework.</p>
      </div>

      {/* Action Cards Carousel */}
      <div className="action-cards-carousel">
        <div className="carousel-container">
          <div className="carousel-track">
            {currentSlide === 0 && (
              <div className="carousel-item">
                <MintSection onDeployToken={handleDeployToken} />
              </div>
            )}
            
            {currentSlide === 1 && (
              <div className="carousel-item">
                <TransferSection tokens={tokens} onTransfer={handleTransfer} />
              </div>
            )}
            
            {currentSlide === 2 && (
              <div className="carousel-item">
                <DeployTokenSection onDeployToken={handleDeployToken} />
              </div>
            )}
          </div>
          
          {/* Carousel Navigation */}
          <div className="carousel-navigation">
            <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
              ‹
            </button>
            <div className="carousel-dots">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
            <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid - Your Tokens and Transactions */}
      <div className="homepage-grid bottom-grid">
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
