import React, { useState } from 'react';

interface MintSectionProps {
  onDeployToken?: (tokenData: { name: string; symbol: string; supply: string }) => void;
}

export const MintSection: React.FC<MintSectionProps> = ({ onDeployToken }) => {
  const [assetName, setAssetName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    if (!assetName || !symbol || !tokenSupply) {
      alert('Please fill in all fields');
      return;
    }

    setIsDeploying(true);
    
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onDeployToken) {
        onDeployToken({
          name: assetName,
          symbol: symbol,
          supply: tokenSupply
        });
      }
      
      // Reset form
      setAssetName('');
      setSymbol('');
      setTokenSupply('');
      
      // Show success message (this will be replaced with toast notifications)
      alert('Token deployed successfully!');
    } catch (error) {
      console.error('Deployment failed:', error);
      alert('Deployment failed. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="homepage-section">
      <h3 className="section-header">Mint</h3>
      
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
