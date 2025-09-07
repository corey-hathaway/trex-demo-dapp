import React, { useState } from 'react';
import { trexDeploymentService } from '../services/trexDeployment';

interface TestDeploymentProps {
  walletAddress?: string | null;
}

export const TestDeployment: React.FC<TestDeploymentProps> = ({ walletAddress }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runNetworkTest = async () => {
    try {
      setIsTesting(true);
      setError(null);
      setTestResults(null);

      console.log('🧪 Starting Paseo testnet connectivity test...');

      // Test 1: Network Info
      const networkInfo = await trexDeploymentService.getNetworkInfo();
      console.log('📡 Network Info:', networkInfo);

      // Test 2: T-REX Factory Availability
      const factoryAvailable = await trexDeploymentService.checkTREXFactoryAvailability();
      console.log('🏭 T-REX Factory Available:', factoryAvailable);

      // Test 3: Deployment Config
      const deploymentConfig = trexDeploymentService.getDeploymentConfig();
      console.log('⚙️ Deployment Config:', deploymentConfig);

      setTestResults({
        networkInfo,
        factoryAvailable,
        deploymentConfig,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Network test completed successfully!');

    } catch (error) {
      console.error('❌ Network test failed:', error);
      setError(error instanceof Error ? error.message : 'Network test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const testTokenDeployment = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsTesting(true);
      setError(null);

      console.log('🚀 Testing token deployment...');

      // Test deployment with mock parameters
      const deploymentResult = await trexDeploymentService.deployTREXToken({
        name: 'Test Token',
        symbol: 'TEST',
        decimals: 0,
        owner: walletAddress as `0x${string}`,
        identityRegistry: '0x0000000000000000000000000000000000000000', // Mock address
        compliance: '0x0000000000000000000000000000000000000000', // Mock address
        onchainID: '0x0000000000000000000000000000000000000000' // Mock address
      });

      console.log('📝 Deployment Result:', deploymentResult);

      setTestResults(prev => ({
        ...prev,
        deploymentTest: deploymentResult,
        deploymentTimestamp: new Date().toISOString()
      }));

    } catch (error) {
      console.error('❌ Deployment test failed:', error);
      setError(error instanceof Error ? error.message : 'Deployment test failed');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="homepage-section">
      <div className="section-header">
        <h3>🧪 Paseo Testnet Testing</h3>
        <p>Test connectivity and deployment on Paseo testnet (Passet Hub)</p>
      </div>

      <div className="space-y-4">
        {/* Network Test Button */}
        <button
          onClick={runNetworkTest}
          disabled={isTesting}
          className="btn-primary w-full"
        >
          {isTesting ? 'Testing Network...' : 'Test Network Connectivity'}
        </button>

        {/* Deployment Test Button */}
        <button
          onClick={testTokenDeployment}
          disabled={isTesting || !walletAddress}
          className="btn-secondary w-full"
        >
          {isTesting ? 'Testing Deployment...' : 'Test Token Deployment'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {/* Test Results */}
        {testResults && (
          <div className="test-results">
            <h4>📊 Test Results</h4>
            
            {/* Network Info */}
            {testResults.networkInfo && (
              <div className="result-section">
                <h5>🌐 Network Information</h5>
                <pre className="result-json">
                  {JSON.stringify(testResults.networkInfo, null, 2)}
                </pre>
              </div>
            )}

            {/* Factory Status */}
            {testResults.factoryAvailable !== undefined && (
              <div className="result-section">
                <h5>🏭 T-REX Factory Status</h5>
                <p className={testResults.factoryAvailable ? 'text-green-400' : 'text-red-400'}>
                  {testResults.factoryAvailable ? '✅ Available' : '❌ Not Available'}
                </p>
              </div>
            )}

            {/* Deployment Config */}
            {testResults.deploymentConfig && (
              <div className="result-section">
                <h5>⚙️ Deployment Configuration</h5>
                <pre className="result-json">
                  {JSON.stringify(testResults.deploymentConfig, null, 2)}
                </pre>
              </div>
            )}

            {/* Deployment Test */}
            {testResults.deploymentTest && (
              <div className="result-section">
                <h5>🚀 Deployment Test Result</h5>
                <pre className="result-json">
                  {JSON.stringify(testResults.deploymentTest, null, 2)}
                </pre>
              </div>
            )}

            <div className="text-sm text-gray-400 mt-4">
              Last updated: {new Date(testResults.timestamp || testResults.deploymentTimestamp).toLocaleString()}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <h4>📋 Instructions</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>First, get PAS test tokens from the <a href="https://paritytech.github.io/polkadot-testnet-faucet/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Paseo Faucet</a></li>
            <li>Make sure to select "Passet Hub: smart contracts" in the chain dropdown</li>
            <li>Connect your wallet to the dApp</li>
            <li>Run the network connectivity test</li>
            <li>Test token deployment (this will use mock addresses for now)</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
