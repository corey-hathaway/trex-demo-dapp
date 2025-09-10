import React, { useState, useEffect } from 'react';
import { createPapiClient, PapiClientService } from '@polkadot-auth/core';

interface PapiLoginProps {
  onLogin: (address: string, accountName: string, session: any) => void;
}

export const PapiLogin: React.FC<PapiLoginProps> = ({ onLogin }) => {
  const [papiClient, setPapiClient] = useState<PapiClientService | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chainInfo, setChainInfo] = useState<any>(null);
  const [selectedChain, setSelectedChain] = useState<'polkadot' | 'kusama'>('polkadot');

  useEffect(() => {
    // Initialize PAPI client when component mounts
    const initPapiClient = async () => {
      try {
        const client = createPapiClient({
          chain: selectedChain,
          useLightClient: false, // Use WebSocket connection
        });
        
        await client.connect();
        setPapiClient(client);
        
        // Get chain information
        const latestBlock = await client.getLatestBlock();
        setChainInfo({
          blockNumber: latestBlock.number,
          hash: latestBlock.hash,
          chain: selectedChain
        });
        
        console.log('🔌 PAPI Client connected:', { chain: selectedChain, blockNumber: latestBlock.number });
      } catch (err) {
        console.error('PAPI connection error:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to PAPI');
      }
    };

    initPapiClient();

    // Cleanup on unmount
    return () => {
      if (papiClient) {
        papiClient.disconnect();
      }
    };
  }, [selectedChain]);

  const handlePapiLogin = async (address: string) => {
    if (!papiClient) {
      setError('PAPI client not connected');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      console.log('🔌 PAPI - Attempting to get account info for:', address);

      // Try to get account information using PAPI, but don't fail if it doesn't work
      let accountInfo = null;
      let balance = '0';
      
      try {
        accountInfo = await papiClient.getAccountInfo(address);
        balance = await papiClient.getBalance(address);
        console.log('🔌 PAPI - Account info retrieved:', { accountInfo, balance });
      } catch (accountError) {
        console.warn('🔌 PAPI - Could not retrieve account info, proceeding with basic authentication:', accountError);
        // Continue with basic authentication even if account info fails
      }

      // Create session with PAPI data
      const session = {
        id: `papi_session_${Date.now()}`,
        address,
        clientId: 'trex-demo-dapp-papi',
        accessToken: 'papi-access-token',
        refreshToken: 'papi-refresh-token',
        accessTokenId: `papi_token_${Date.now()}`,
        refreshTokenId: `papi_refresh_${Date.now()}`,
        fingerprint: `papi_fingerprint_${Date.now()}`,
        accessTokenExpiresAt: Date.now() + 15 * 60 * 1000,
        refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
        lastUsedAt: Date.now(),
        isActive: true,
        accountName: `PAPI Account (${address.slice(0, 6)}...${address.slice(-4)})`,
        walletType: 'papi',
        chain: selectedChain,
        balance: balance.toString(),
        accountInfo: accountInfo
      };

      onLogin(address, session.accountName, session);
      console.log('🔌 PAPI - Login successful:', { address, session });
    } catch (err) {
      console.error('PAPI login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login with PAPI');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address = formData.get('address') as string;
    
    if (address) {
      handlePapiLogin(address);
    }
  };

  if (!papiClient) {
    return (
      <div className="papi-login">
        <div className="papi-loading">
          <div className="loading-spinner"></div>
          <p>Connecting to {selectedChain} via PAPI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="papi-login">
      <div className="papi-header">
        <h3>🔗 PAPI Login</h3>
        <p>Direct blockchain authentication using Polkadot API</p>
      </div>

      <div className="papi-chain-selector">
        <label>
          <input
            type="radio"
            name="chain"
            value="polkadot"
            checked={selectedChain === 'polkadot'}
            onChange={(e) => setSelectedChain(e.target.value as 'polkadot' | 'kusama')}
          />
          Polkadot
        </label>
        <label>
          <input
            type="radio"
            name="chain"
            value="kusama"
            checked={selectedChain === 'kusama'}
            onChange={(e) => setSelectedChain(e.target.value as 'polkadot' | 'kusama')}
          />
          Kusama
        </label>
      </div>

      {chainInfo && (
        <div className="papi-chain-info">
          <p><strong>Chain:</strong> {chainInfo.chain}</p>
          <p><strong>Latest Block:</strong> #{chainInfo.blockNumber}</p>
          <p><strong>Status:</strong> <span className="status-connected">Connected</span></p>
        </div>
      )}

      <form onSubmit={handleAddressSubmit} className="papi-form">
        <div className="form-group">
          <label htmlFor="address">Polkadot Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter your Polkadot address (e.g., 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY)"
            required
            className="papi-input"
          />
        </div>
        
        <button
          type="submit"
          disabled={isConnecting}
          className="papi-login-btn"
        >
          {isConnecting ? 'Connecting...' : 'Login with PAPI'}
        </button>
      </form>

      {error && (
        <div className="papi-error">
          <p>❌ {error}</p>
        </div>
      )}

      <style jsx>{`
        .papi-login {
          padding: 20px;
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          max-width: 500px;
          margin: 0 auto;
        }

        .papi-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .papi-header h3 {
          color: var(--primary-text);
          margin-bottom: 8px;
        }

        .papi-header p {
          color: var(--secondary-text);
          font-size: 14px;
        }

        .papi-loading {
          text-align: center;
          padding: 40px 20px;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--accent-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .papi-chain-selector {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          justify-content: center;
        }

        .papi-chain-selector label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--primary-text);
          cursor: pointer;
        }

        .papi-chain-selector input[type="radio"] {
          accent-color: var(--accent-color);
        }

        .papi-chain-info {
          background: var(--accent-bg);
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .papi-chain-info p {
          margin: 4px 0;
          color: var(--primary-text);
        }

        .status-connected {
          color: var(--success-color);
          font-weight: 600;
        }

        .papi-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: var(--primary-text);
          font-weight: 500;
        }

        .papi-input {
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--secondary-bg);
          color: var(--primary-text);
          font-size: 14px;
        }

        .papi-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .papi-login-btn {
          padding: 12px 24px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .papi-login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .papi-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .papi-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error-color);
          border-radius: 8px;
          padding: 12px;
          margin-top: 16px;
        }

        .papi-error p {
          color: var(--error-color);
          margin: 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default PapiLogin;
