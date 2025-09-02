import React, { useState } from 'react';
import { useAccount, useDeployContract, useWaitForTransactionReceipt } from 'wagmi';
import { identityregistrystorageproxyAbi } from '../generated';
import { loadIdentityRegistryStorageProxyBytecode } from '../utils/loadContractBytecode';
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

export function IdentityStorageDeployment() {
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
      const defaultSalt = `IRS_${Date.now()}_${userAddress.slice(-6)}`;
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
      const bytecode = await loadIdentityRegistryStorageProxyBytecode();
      console.log('Bytecode loaded, length:', bytecode.length);
      
      setIsLoadingBytecode(false);

      // Step 3: Deploy contract using wagmi
      await deployContract({
        abi: identityregistrystorageproxyAbi,
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
    <div className="max-w-2xl mx-auto mb-8">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Step 3 of 5: IdentityRegistry Storage</h2>
            <p className="text-green-100">Stores identity verification data for T-REX tokens</p>
          </div>
          <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            3
          </div>
        </div>
      </div>

      <div className="bg-white border-l border-r border-green-200 p-6">
        {/* Prerequisites Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <h3 className="font-medium text-yellow-800">Prerequisites:</h3>
          <ul className="text-yellow-700 text-sm mt-1">
            <li>• Wallet connected to chain 420420420</li>
            <li>• Sufficient ETH balance for gas fees</li>
            <li>• TrustedIssuers Registry deployed (Step 1)</li>
            <li>• ClaimTopics Registry deployed (Step 2)</li>
            <li>• Implementation Authority: 0x867fb...6F</li>
          </ul>
        </div>

        {/* Contract Purpose Explanation */}
        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">What this contract does:</h3>
          <p className="text-gray-600 text-sm mb-2">
            The IdentityRegistry Storage provides persistent storage for identity verification data. 
            It maintains the mapping between wallet addresses and their verified identities, 
            storing information about which claims have been verified for each address.
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Key functions:</span> Store identity-to-wallet mappings, 
            track verification status, maintain claim validity, enable identity lookups.
          </p>
        </div>

        {/* Reuse Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <h3 className="font-medium text-blue-800">💡 Storage Reusability:</h3>
          <p className="text-blue-700 text-sm">
            This storage contract can be shared across multiple T-REX tokens to reduce gas costs. 
            The same identity verification data can serve multiple token ecosystems.
          </p>
        </div>

        {/* Connection Status */}
        {!userAddress && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800">Please connect your wallet to deploy contracts.</p>
          </div>
        )}

        {/* Chain Info */}
        {userAddress && chainId && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-800">
              <span className="font-medium">Connected:</span> {userAddress} | 
              <span className="font-medium"> Chain:</span> {chainId}
            </p>
          </div>
        )}
        
        {/* Form Step */}
        {step === 'form' && (
          <div className="border border-gray-200 rounded-lg p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleDeploy(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deployment Salt (Optional)
                </label>
                <input
                  type="text"
                  value={formData.salt}
                  onChange={(e) => setFormData(prev => ({ ...prev, salt: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter unique deployment salt"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for deterministic contract addresses. Auto-generated if empty.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Deployment Details:</h3>
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Contract:</span> IdentityRegistryStorageProxy
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Constructor:</span> Implementation Authority Address
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Purpose:</span> Persistent storage for identity data
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
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {!userAddress 
                  ? 'Connect Wallet First' 
                  : isPending 
                    ? 'Deploying...' 
                    : 'Deploy IdentityRegistry Storage'
                }
              </button>
            </form>
          </div>
        )}

        {/* Deploying Step */}
        {step === 'deploying' && (
          <div className="border border-green-200 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              {isLoadingBytecode ? 'Loading Contract Bytecode...' : 'Deploying Contract...'}
            </h3>
            <p className="text-green-700">
              {isLoadingBytecode 
                ? 'Importing contract artifacts from T-REX directory...'
                : isConfirming 
                  ? 'Waiting for transaction confirmation...' 
                  : 'Please confirm the transaction in your wallet.'
              }
            </p>
            
            {hash && (
              <div className="mt-4 bg-green-50 rounded-md p-3">
                <p className="text-xs text-green-600">
                  <span className="font-medium">Transaction Hash:</span>
                </p>
                <code className="text-xs text-green-800 break-all">{hash}</code>
              </div>
            )}
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && deployedContract && (
          <div className="border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              IdentityRegistry Storage Deployed Successfully!
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
                This is your deployed IdentityRegistry Storage contract address!
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

            {/* Next Steps Guidance */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <h4 className="font-medium text-green-900 mb-2">✅ Next Steps:</h4>
              <ul className="text-green-800 text-sm text-left space-y-1">
                <li>• Copy the deployed contract address above</li>
                <li>• Proceed to Step 4: IdentityRegistry deployment (combines all registries)</li>
                <li>• You'll need TrustedIssuers, ClaimTopics, and this Storage address</li>
                <li>• This storage can be reused for multiple token deployments</li>
              </ul>
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Deploy Another Contract
            </button>
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="border border-red-200 rounded-lg p-6 text-center">
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
              <ul className="text-yellow-800 text-sm text-left space-y-1">
                <li>• Insufficient gas or ETH balance</li>
                <li>• Network connectivity issues</li>
                <li>• Wallet transaction rejected</li>
                <li>• Invalid implementation authority address</li>
                <li>• Missing prerequisites (TrustedIssuers & ClaimTopics)</li>
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

      {/* Progress Footer */}
      <div className="bg-gray-50 border border-t-0 border-green-200 rounded-b-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Progress: Step 3 of 5</span>
          <div className="flex space-x-1">
            <div className="w-8 h-2 bg-blue-500 rounded" title="Step 1: TrustedIssuers"></div>
            <div className="w-8 h-2 bg-purple-500 rounded" title="Step 2: ClaimTopics"></div>
            <div className="w-8 h-2 bg-green-500 rounded" title="Step 3: IdentityStorage (Current)"></div>
            <div className="w-8 h-2 bg-gray-200 rounded" title="Step 4: IdentityRegistry"></div>
            <div className="w-8 h-2 bg-gray-200 rounded" title="Step 5: Token"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
