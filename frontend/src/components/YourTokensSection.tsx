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
  // Mock data for demonstration
  const mockTokens: Token[] = [
    {
      name: 'Commercial Property',
      symbol: 'CPL',
      supply: '500',
      value: '$500,000',
      address: '0x742d...5E8a'
    },
    {
      name: 'Real Estate Fund',
      symbol: 'REF',
      supply: '1000',
      value: '$1,200,000',
      address: '0x1234...5678'
    }
  ];

  const displayTokens = tokens.length > 0 ? tokens : mockTokens;

  return (
    <div className="homepage-section">
      <h3 className="section-header">Your Tokens</h3>
      
      <div className="tokens-list">
        {displayTokens.map((token, index) => (
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
        ))}
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
