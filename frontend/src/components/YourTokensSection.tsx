import React from 'react';

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
  console.log('YourTokensSection - tokens received:', tokens);
  console.log('YourTokensSection - tokens.length:', tokens.length);

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
              onClick={() => onViewToken?.(token)}
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
        onClick={onViewAll}
        className="btn-secondary view-all-btn"
      >
        View All
      </button>
    </div>
  );
};
