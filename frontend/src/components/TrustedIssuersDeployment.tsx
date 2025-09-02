import React, { useState } from 'react';
import { useAccount, useDeployContract, useWaitForTransactionReceipt } from 'wagmi';
import { trustedissuersregistryproxyAbi } from '../generated';
import { loadTrustedIssuersProxyBytecode } from '../utils/loadContractBytecode';
import { getDeploymentConfig, validateDeploymentConfig } from '../utils/deploymentConfig';

interface FormData {
  salt: string;
}

interface DeployedContract {
  address: string;
  transactionHash: string;
  blockNumber: number;
}

type DeploymentStep = 'form' | 'deploying' | 'success' | 'error';

export function TrustedIssuersDeployment() {
  const { address: userAddress, chainId } = useAccount();
  const { deployContract, data: hash, error: deployError, isPending } = useDeployContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });

  const [step, setStep] = useState<DeploymentStep>('form');
  const [formData, setFormData] = useState<FormData>({ salt: '' });
  const [deployedContract, setDeployedContract] = useState<DeployedContract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingBytecode, setIsLoadingBytecode] = useState(false);

  // Generate default salt
  React.useEffect(() => {
    if (userAddress && !formData.salt) {
      const defaultSalt = `TIR_${Date.now()}_${userAddress.slice(-6)}`;
      setFormData(prev => ({ ...prev, salt: defaultSalt }));
    }
  }, [userAddress, formData.salt]);

  // Handle deployment
  const handleDeploy = async () => {
    if (!userAddress || !chainId) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setStep('deploying');
      setError(null);
      setIsLoadingBytecode(true);

      // Step 1: Load deployment configuration
      const config = getDeploymentConfig(chainId);
      
      // Validate configuration
      if (!validateDeploymentConfig(config)) {
        throw new Error('Invalid deployment configuration');
      }
      
      console.log('Using implementation authority:', config.implementationAuthority);

      // Step 2: Load contract bytecode dynamically
      const bytecode = await loadTrustedIssuersProxyBytecode();
      console.log('Bytecode loaded, length:', bytecode.length);
      
      setIsLoadingBytecode(false);

      // Step 3: Deploy contract using wagmi
      await deployContract({
        abi: trustedissuersregistryproxyAbi,
        bytecode: bytecode,
        args: [config.implementationAuthority as `0x${string}`]
      });

    } catch (error) {
      console.error('Deployment error:', error);
      setError(error instanceof Error ? error.message : 'Unknown deployment error');
      setStep('error');
      setIsLoadingBytecode(false);
    }
  };

  // Handle success/error state changes
  React.useEffect(() => {
    if (isSuccess && receipt && step === 'deploying') {
      const deployed: DeployedContract = {
        address: receipt.contractAddress || '',
        transactionHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber)
      };
      setDeployedContract(deployed);
      setStep('success');
    }
    
    if (deployError && step === 'deploying') {
      setError(deployError.message);
      setStep('error');
    }
  }, [isSuccess, receipt, deployError, step]);

  const resetForm = () => {
    setStep('form');
    setError(null);
    setDeployedContract(null);
    setFormData({ salt: '' });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Deploy TrustedIssuersRegistry Proxy</h2>
      
      {/* Connection Status */}
      {!userAddress && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">Please connect your wallet to deploy contracts.</p>
        </div>
      )}

      {/* Chain Info */}
      {userAddress && chainId && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-blue-800">
            <span className="font-medium">Connected:</span> {userAddress} | 
            <span className="font-medium"> Chain:</span> {chainId}
          </p>
        </div>
      )}
      
      {/* Form Step */}
      {step === 'form' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleDeploy(); }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deployment Salt (Optional)
              </label>
              <input
                type="text"
                value={formData.salt}
                onChange={(e) => setFormData(prev => ({ ...prev, salt: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter unique deployment salt"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for deterministic contract addresses. Auto-generated if empty.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">What will be deployed:</h3>
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Contract:</span> TrustedIssuersRegistryProxy
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Constructor:</span> Implementation Authority Address
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Purpose:</span> Manages trusted claim issuers for T-REX tokens
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!userAddress || isPending}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {!userAddress 
                ? 'Connect Wallet First' 
                : isPending 
                  ? 'Deploying...' 
                  : 'Deploy TrustedIssuersRegistry'
              }
            </button>
          </form>
        </div>
      )}

      {/* Deploying Step */}
      {step === 'deploying' && (
        <div className="bg-white border border-blue-200 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            {isLoadingBytecode ? 'Loading Contract Bytecode...' : 'Deploying Contract...'}
          </h3>
          <p className="text-blue-700">
            {isLoadingBytecode 
              ? 'Importing contract artifacts from T-REX directory...'
              : isConfirming 
                ? 'Waiting for transaction confirmation...' 
                : 'Please confirm the transaction in your wallet.'
            }
          </p>
          
          {hash && (
            <div className="mt-4 bg-blue-50 rounded-md p-3">
              <p className="text-xs text-blue-600">
                <span className="font-medium">Transaction Hash:</span>
              </p>
              <code className="text-xs text-blue-800 break-all">{hash}</code>
            </div>
          )}
        </div>
      )}

      {/* Success Step */}
      {step === 'success' && deployedContract && (
        <div className="bg-white border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            TrustedIssuersRegistry Deployed Successfully!
          </h3>
          
          {/* Contract Address Highlight */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-md p-4 mb-4">
            <h4 className="font-bold text-blue-900 mb-2">🎉 Contract Address</h4>
            <div className="bg-white border border-blue-200 rounded p-3">
              <code className="text-lg font-mono text-blue-800 break-all">
                {deployedContract.address}
              </code>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              This is your deployed TrustedIssuersRegistry contract address!
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 text-left">
            <h4 className="font-medium text-green-900 mb-2">Deployment Details</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div>
                <span className="font-medium">Transaction:</span>{' '}
                <code className="text-xs">{deployedContract.transactionHash}</code>
              </div>
              <div><span className="font-medium">Block Number:</span> {deployedContract.blockNumber}</div>
              <div><span className="font-medium">Chain ID:</span> {chainId}</div>
              <div><span className="font-medium">Deployer:</span> {userAddress}</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ Next Steps</h4>
            <ul className="text-sm text-yellow-800 text-left space-y-1">
              <li>• Add trusted claim issuers to this registry</li>
              <li>• Configure claim topics for your token requirements</li>
              <li>• Use this address when deploying tokens that need trusted issuers</li>
            </ul>
          </div>

          <button
            onClick={resetForm}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Deploy Another Contract
          </button>
        </div>
      )}

      {/* Error Step */}
      {step === 'error' && (
        <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Deployment Failed</h3>
          
          {error && (
            <div className="bg-red-50 rounded-md p-3 mb-4">
              <p className="text-sm text-red-700">
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <h4 className="font-medium text-yellow-900 mb-2">Common Issues:</h4>
            <ul className="text-sm text-yellow-800 text-left space-y-1">
              <li>• Insufficient gas or ETH balance</li>
              <li>• Network connectivity issues</li>
              <li>• Wallet transaction rejected</li>
              <li>• Invalid implementation authority address</li>
            </ul>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleDeploy}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={resetForm}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
