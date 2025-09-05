import React, { useState } from 'react';

interface DeployTokenSectionProps {
  onDeployToken: (tokenData: { name: string; symbol: string; supply: string }) => void;
}

export const DeployTokenSection: React.FC<DeployTokenSectionProps> = ({ onDeployToken }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.symbol && formData.supply) {
      onDeployToken(formData);
      setFormData({ name: '', symbol: '', supply: '' });
    }
  };

  return (
    <div className="homepage-section">
      <div className="section-header">
        <h3>Deploy ERC-3643 Token</h3>
      </div>
      
      <form onSubmit={handleDeploy} className="space-y-4">
        <div className="form-group">
          <label className="form-label">Token Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., My Security Token"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Symbol</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., MST"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Total Supply</label>
          <input
            type="number"
            name="supply"
            value={formData.supply}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 1000000"
            min="1"
            required
          />
        </div>
        
        <button type="submit" className="deploy-token-btn">
          Deploy Token
        </button>
      </form>
    </div>
  );
};
