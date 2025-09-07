import React, { useState, useEffect } from 'react';
import { MintSection } from './MintSection';
import { TransferSection } from './TransferSection';
import { DeployTokenSection } from './DeployTokenSection';
import { YourTokensSection } from './YourTokensSection';
import { TransactionsSection } from './TransactionsSection';
import { ToastContainer } from './ToastContainer';
import { useToast } from '../hooks/useToast';
import { apiService, Token as ApiToken, Transaction as ApiTransaction } from '../services/api';
import { polkadotTREXDeploymentService } from '../services/polkadotTREXDeployment';

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

interface NewHomepageProps {
  walletAddress?: string | null;
}

export const NewHomepage: React.FC<NewHomepageProps> = ({ walletAddress }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [networkTestResult, setNetworkTestResult] = useState<string | null>(null);
  const [deploymentTestResult, setDeploymentTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Load data from API on component mount and when wallet address changes
  useEffect(() => {
    const loadData = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      try {
        // Load tokens for the current wallet
        const tokensResponse = await apiService.getTokensByOwner(walletAddress);
        if (tokensResponse.success) {
          const formattedTokens: Token[] = tokensResponse.data.map((apiToken: ApiToken) => ({
            name: apiToken.name,
            symbol: apiToken.symbol,
            supply: apiToken.supply,
            value: apiToken.value,
            address: apiToken.formattedAddress
          }));
          setTokens(formattedTokens);
        }

        // Load all transactions
        const transactionsResponse = await apiService.getTransactions();
        if (transactionsResponse.success) {
          const formattedTransactions: Transaction[] = transactionsResponse.data.map((apiTransaction: ApiTransaction) => ({
            type: apiTransaction.type,
            amount: apiTransaction.amount,
            symbol: apiTransaction.token_symbol || apiTransaction.symbol || 'TOKEN',
            recipient: apiTransaction.recipient,
            timestamp: apiTransaction.timestamp,
            hash: apiTransaction.formattedHash
          }));
          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data from server');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [walletAddress, showError]);

  const handleDeployToken = async (tokenData: { name: string; symbol: string; supply: string }) => {
    try {
      if (!walletAddress) {
        showError('Please connect your wallet first.');
        return;
      }

      // Step 1: Create the token
      const createResponse = await apiService.createToken({
        name: tokenData.name,
        symbol: tokenData.symbol,
        supply: tokenData.supply,
        decimals: 0,
        owner_address: walletAddress
      });

      if (!createResponse.success) {
        showError(`Failed to create token: ${(createResponse as any).error || 'Unknown error'}`);
        return;
      }

      const tokenId = createResponse.data.id;
      console.log('Token created with ID:', tokenId);

      // Step 2: Deploy the token using Polkadot.js Extension
      console.log('🚀 Starting real T-REX deployment with Polkadot.js Extension...');
      
      const deploymentResult = await polkadotTREXDeploymentService.deployTREXToken({
        name: tokenData.name,
        symbol: tokenData.symbol,
        decimals: 0,
        owner: walletAddress, // Polkadot address format
        identityRegistry: '0x0000000000000000000000000000000000000000', // Mock address for now
        compliance: '0x0000000000000000000000000000000000000000', // Mock address for now
        onchainID: '0x0000000000000000000000000000000000000000' // Mock address for now
      });
      
      if (!deploymentResult.success) {
        showError(`Failed to deploy token: ${deploymentResult.error}`);
        return;
      }

      console.log('Token deployed with contract address:', deploymentResult.contractAddress);
      
      // Update the backend with the deployment result
      const deployResponse = await apiService.deployToken(tokenId);
      
      if (!deployResponse.success) {
        console.warn('Backend deployment update failed:', (deployResponse as any).error || 'Unknown error');
        // Continue anyway since the real deployment succeeded
      }

      // Step 3: Refresh data from API to get the latest tokens and transactions
      const tokensResponse = await apiService.getTokensByOwner(walletAddress);
      if (tokensResponse.success) {
        const formattedTokens: Token[] = tokensResponse.data.map((apiToken: ApiToken) => ({
          name: apiToken.name,
          symbol: apiToken.symbol,
          supply: apiToken.supply,
          value: apiToken.value,
          address: apiToken.formattedAddress
        }));
        setTokens(formattedTokens);
      }

      const transactionsResponse = await apiService.getTransactions();
      if (transactionsResponse.success) {
        const formattedTransactions: Transaction[] = transactionsResponse.data.map((apiTransaction: ApiTransaction) => ({
          type: apiTransaction.type,
          amount: apiTransaction.amount,
          symbol: apiTransaction.token_symbol || apiTransaction.symbol || 'TOKEN',
          recipient: apiTransaction.recipient,
          timestamp: apiTransaction.timestamp,
          hash: apiTransaction.formattedHash
        }));
        setTransactions(formattedTransactions);
      }
      
      const successMessage = `Token "${tokenData.name}" (${tokenData.symbol}) deployed to Paseo testnet! 
        Contract: ${deploymentResult.contractAddress}
        Transaction: ${deploymentResult.transactionHash}
        Network: Paseo Testnet (Passet Hub)
        Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/tx/${deploymentResult.transactionHash}`;
      
      showSuccess(successMessage);
    } catch (error) {
      console.error('Error deploying token:', error);
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


  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = (prev + 1) % 5;
      console.log('Next slide:', newSlide);
      return newSlide;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = (prev - 1 + 5) % 5;
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
                <div className="homepage-section">
                  <div className="section-header">
                    <h3>🌐 Network Connectivity</h3>
                    <p>Test connection to Paseo testnet (Passet Hub)</p>
                  </div>
                  <button
                    onClick={async () => {
                      setIsTesting(true);
                      setNetworkTestResult(null);
                      try {
                        const networkInfo = await polkadotTREXDeploymentService.getNetworkInfo();
                        const factoryAvailable = await polkadotTREXDeploymentService.checkTREXFactoryAvailability();
                        const deploymentConfig = polkadotTREXDeploymentService.getDeploymentConfig();
                        
                        setNetworkTestResult(`✅ Connected to Paseo testnet!
Chain: ${networkInfo?.chainName}
Block: ${networkInfo?.blockNumber}
Factory: ${factoryAvailable ? 'Available' : 'Not Available'}
RPC: ${networkInfo?.rpcUrl}`);
                      } catch (error) {
                        setNetworkTestResult(`❌ Failed to connect to Paseo testnet: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      } finally {
                        setIsTesting(false);
                      }
                    }}
                    disabled={isTesting}
                    className="btn-primary"
                  >
                    {isTesting ? 'Testing...' : 'Test Network Connectivity'}
                  </button>
                  
                  {networkTestResult && (
                    <div className="test-result" style={{
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: networkTestResult.startsWith('✅') ? '#f0f9ff' : '#fef2f2',
                      border: `1px solid ${networkTestResult.startsWith('✅') ? '#0ea5e9' : '#ef4444'}`,
                      borderRadius: '6px',
                      color: networkTestResult.startsWith('✅') ? '#0c4a6e' : '#991b1b',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      whiteSpace: 'pre-line'
                    }}>
                      {networkTestResult}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {currentSlide === 1 && (
              <div className="carousel-item">
                <div className="homepage-section">
                  <div className="section-header">
                    <h3>🚀 Token Deployment</h3>
                    <p>Test real T-REX token deployment with your wallet</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (!walletAddress) {
                        setDeploymentTestResult('❌ Please connect your wallet first');
                        return;
                      }
                      
                      setIsTesting(true);
                      setDeploymentTestResult(null);
                      
                      try {
                        const deploymentResult = await polkadotTREXDeploymentService.deployTREXToken({
                          name: 'Test Token',
                          symbol: 'TEST',
                          decimals: 0,
                          owner: walletAddress,
                          identityRegistry: '0x0000000000000000000000000000000000000000',
                          compliance: '0x0000000000000000000000000000000000000000',
                          onchainID: '0x0000000000000000000000000000000000000000'
                        });
                        
                        if (deploymentResult.success) {
                          setDeploymentTestResult(`✅ Test token deployed successfully!
Contract: ${deploymentResult.contractAddress}
Transaction: ${deploymentResult.transactionHash}
Network: Paseo Testnet (Passet Hub)
Explorer: https://blockscout-passet-hub.parity-testnet.parity.io/tx/${deploymentResult.transactionHash}`);
                        } else {
                          setDeploymentTestResult(`❌ Deployment failed: ${deploymentResult.error}`);
                        }
                      } catch (error) {
                        setDeploymentTestResult(`❌ Failed to deploy test token: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      } finally {
                        setIsTesting(false);
                      }
                    }}
                    disabled={!walletAddress || isTesting}
                    className="btn-secondary"
                  >
                    {!walletAddress ? 'Connect Wallet First' : isTesting ? 'Testing...' : 'Test Token Deployment'}
                  </button>
                  
                  {deploymentTestResult && (
                    <div className="test-result" style={{
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: deploymentTestResult.startsWith('✅') ? '#f0f9ff' : '#fef2f2',
                      border: `1px solid ${deploymentTestResult.startsWith('✅') ? '#0ea5e9' : '#ef4444'}`,
                      borderRadius: '6px',
                      color: deploymentTestResult.startsWith('✅') ? '#0c4a6e' : '#991b1b',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      whiteSpace: 'pre-line'
                    }}>
                      {deploymentTestResult}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {currentSlide === 2 && (
              <div className="carousel-item">
                <MintSection onDeployToken={handleDeployToken} walletAddress={walletAddress} />
              </div>
            )}
            
            {currentSlide === 3 && (
              <div className="carousel-item">
                <TransferSection tokens={tokens} onTransfer={handleTransfer} />
              </div>
            )}
            
            {currentSlide === 4 && (
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
              {[
                { index: 0, label: 'Network' },
                { index: 1, label: 'Deploy' },
                { index: 2, label: 'Mint' },
                { index: 3, label: 'Transfer' },
                { index: 4, label: 'Deploy' }
              ].map(({ index, label }) => (
                <button
                  key={index}
                  className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  title={label}
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
