import React, { useState } from 'react';
import { apiService, CreateTokenRequest } from '../services/api';

interface MintSectionProps {
  onDeployToken?: (tokenData: { name: string; symbol: string; supply: string }) => void;
  onTokenCreated?: () => void; // New callback for when a token is just created
  walletAddress?: string | null;
}

export const MintSection: React.FC<MintSectionProps> = ({ onDeployToken, onTokenCreated, walletAddress }) => {
  const [assetName, setAssetName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    console.log('MintSection - handleDeploy called');
    console.log('MintSection - walletAddress:', walletAddress);
    console.log('MintSection - form data:', { assetName, symbol, tokenSupply });
    
    if (!assetName || !symbol || !tokenSupply) {
      setError('Please fill in all fields');
      return;
    }

    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsDeploying(true);
    setError(null);
    
    try {
      // Create token via API
      const tokenData: CreateTokenRequest = {
        name: assetName,
        symbol: symbol,
        supply: tokenSupply,
        decimals: 0,
        owner_address: walletAddress
      };

      const response = await apiService.createToken(tokenData);
      
      if (response.success) {
        // Reset form
        setAssetName('');
        setSymbol('');
        setTokenSupply('');
        
        // Show success message with better styling
        const successMessage = `🎉 Token "${assetName}" (${symbol}) created successfully!
        
✅ Token Details:
• Name: ${assetName}
• Symbol: ${symbol}
• Supply: ${tokenSupply}
• Owner: ${walletAddress}

Your token is now ready for deployment!`;
        
        alert(successMessage);
        
        // Call the callback to refresh data
        if (onTokenCreated) {
          onTokenCreated();
        }
      } else {
        throw new Error('Failed to create token');
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      setError(error instanceof Error ? error.message : 'Deployment failed. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="homepage-section">
      <h3 className="section-header">Mint</h3>
      
      {error && (
        <div className="error-message" style={{ 
          color: '#ef4444', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          padding: '12px', 
          borderRadius: '6px', 
          marginBottom: '16px' 
        }}>
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="assetName" className="form-label">Asset Name</label>
        <input
          id="assetName"
          type="text"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
          placeholder="e.g. Commercial Property"
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="symbol" className="form-label">Symbol</label>
        <input
          id="symbol"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="e.g. CPL"
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tokenSupply" className="form-label">Token Supply</label>
        <input
          id="tokenSupply"
          type="number"
          value={tokenSupply}
          onChange={(e) => setTokenSupply(e.target.value)}
          placeholder="e.g. 1000000"
          className="form-input"
        />
      </div>
      
      <button
        onClick={handleDeploy}
        disabled={isDeploying}
        className="btn-primary deploy-token-btn"
      >
        {isDeploying ? 'Deploying...' : 'Deploy Token'}
      </button>
    </div>
  );
};
