import React, { useState } from 'react';
import { Modal } from './Modal';

interface Token {
  name: string;
  symbol: string;
  supply: string;
  value: string;
  address: string;
}

interface YourTokensSectionProps {
  tokens?: Token[];
  onViewToken?: (token: Token) => void;
  onViewAll?: () => void;
}

export const YourTokensSection: React.FC<YourTokensSectionProps> = ({ 
  tokens = [], 
  onViewToken, 
  onViewAll 
}) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  
  console.log('YourTokensSection - tokens received:', tokens);
  console.log('YourTokensSection - tokens.length:', tokens.length);

  const handleViewToken = (token: Token) => {
    setSelectedToken(token);
  };

  const handleViewAll = () => {
    setShowViewAllModal(true);
  };

  return (
    <div className="homepage-section">
      <h3 className="section-header">Your Tokens</h3>
      
      <div className="tokens-list">
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
          <div key={index} className="token-item">
            <div className="token-info">
              <div className="token-name">{token.name}</div>
              <div className="token-details">
                {token.symbol} • {token.supply} supply • {token.value}
              </div>
            </div>
            <button
              onClick={() => handleViewToken(token)}
              className="btn-secondary view-token-btn"
            >
              View
            </button>
          </div>
          ))
        ) : (
          <div className="no-tokens-message">
            <p>No tokens found. Create your first token using the Mint section above!</p>
          </div>
        )}
      </div>
      
      <button
        onClick={handleViewAll}
        className="btn-secondary view-all-btn"
      >
        View All
      </button>

      {/* Token Detail Modal */}
      <Modal
        isOpen={!!selectedToken}
        onClose={() => setSelectedToken(null)}
        title={selectedToken ? `${selectedToken.name} (${selectedToken.symbol})` : ''}
      >
        {selectedToken && (
          <div className="token-detail-modal">
            <div className="token-detail-grid">
              <div className="token-detail-item">
                <label>Name:</label>
                <span>{selectedToken.name}</span>
              </div>
              <div className="token-detail-item">
                <label>Symbol:</label>
                <span>{selectedToken.symbol}</span>
              </div>
              <div className="token-detail-item">
                <label>Supply:</label>
                <span>{selectedToken.supply}</span>
              </div>
              <div className="token-detail-item">
                <label>Value:</label>
                <span>{selectedToken.value}</span>
              </div>
              <div className="token-detail-item">
                <label>Contract Address:</label>
                <span className="contract-address">{selectedToken.address}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* View All Tokens Modal */}
      <Modal
        isOpen={showViewAllModal}
        onClose={() => setShowViewAllModal(false)}
        title="All Your Tokens"
      >
        <div className="all-tokens-modal">
          {tokens.length > 0 ? (
            <div className="tokens-grid">
              {tokens.map((token, index) => (
                <div key={index} className="token-card">
                  <h4>{token.name}</h4>
                  <p><strong>Symbol:</strong> {token.symbol}</p>
                  <p><strong>Supply:</strong> {token.supply}</p>
                  <p><strong>Value:</strong> {token.value}</p>
                  <p><strong>Address:</strong> <span className="contract-address">{token.address}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tokens-message">
              <p>No tokens found. Create your first token using the Mint section!</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
