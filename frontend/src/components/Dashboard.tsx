import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface TokenData {
  name: string;
  symbol: string;
  totalSupply: string;
  contractAddress: string;
  holderCount: number;
  lastUpdated: string;
  assetValue: string;
}

export const Dashboard: React.FC = () => {
  const { address } = useAccount();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration - in real app this would come from blockchain
  useEffect(() => {
    const mockTokenData: TokenData = {
      name: "TREXDINO",
      symbol: "TREX",
      totalSupply: "500 TREX",
      contractAddress: "0xEC69d4f48f4f1740976968FAb9828d645Ad1d77f",
      holderCount: 3,
      lastUpdated: "2 hours ago",
      assetValue: "$500,000"
    };

    // Simulate loading
    setTimeout(() => {
      setTokenData(mockTokenData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading asset data...</p>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="dashboard-error">
        <h2>No Asset Data Found</h2>
        <p>Please deploy a token first or check your connection.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Asset Dashboard</h1>
        <p className="dashboard-subtitle">View and manage your tokenized asset details</p>
      </div>

      <div className="dashboard-grid">
        {/* Asset Overview Card */}
        <div className="dashboard-card asset-overview">
          <div className="card-header">
            <h3>Asset Overview</h3>
            <div className="asset-badge">{tokenData.symbol}</div>
          </div>
          <div className="asset-details">
            <div className="asset-name">{tokenData.name}</div>
            <div className="asset-symbol">{tokenData.symbol}</div>
            <div className="asset-supply">
              <span className="label">Total Supply:</span>
              <span className="value">{tokenData.totalSupply}</span>
            </div>
          </div>
        </div>

        {/* Contract Information */}
        <div className="dashboard-card contract-info">
          <h3>Smart Contract</h3>
          <div className="contract-address">
            <span className="label">Contract Address:</span>
            <div className="address-container">
              <code className="address">{tokenData.contractAddress}</code>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(tokenData.contractAddress)}
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="dashboard-card statistics">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Current Holders</span>
              <span className="stat-value">{tokenData.holderCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Asset Value</span>
              <span className="stat-value">{tokenData.assetValue}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">{tokenData.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Token Distribution Chart Placeholder */}
        <div className="dashboard-card chart-container">
          <h3>Token Distribution</h3>
          <div className="chart-placeholder">
            <div className="chart-icon">📊</div>
            <p>Distribution chart coming soon</p>
            <p className="chart-note">Visual representation of token holder distribution</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <button className="btn-primary">View on Explorer</button>
        <button className="btn-secondary">Export Data</button>
        <button className="btn-secondary">Manage Permissions</button>
      </div>
    </div>
  );
};
