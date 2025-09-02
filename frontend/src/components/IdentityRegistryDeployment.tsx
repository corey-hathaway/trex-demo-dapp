import React, { useState } from 'react';
import { useAccount, useDeployContract, useWaitForTransactionReceipt } from 'wagmi';
import { identityregistryproxyAbi } from '../generated';
import { loadIdentityRegistryProxyBytecode } from '../utils/loadContractBytecode';
import { getDeploymentConfig, validateDeploymentConfig } from '../utils/deploymentConfig';

interface FormData {
  salt: string;
  trustedIssuersAddress: string;
  claimTopicsAddress: string;
  identityStorageAddress: string;
}

interface DeployedContract {
  address: string;
  transactionHash: string;
  blockNumber: number;
}

type DeploymentStep = 'form' | 'deploying' | 'success' | 'error';

export function IdentityRegistryDeployment() {
  const { address: userAddress, chainId } = useAccount();
  const { deployContract, data: deployHash, error: deployError, isPending: isDeployPending } = useDeployContract();
  const { isLoading: isDeployConfirming, isSuccess: isDeploySuccess, data: deployReceipt } = useWaitForTransactionReceipt({ hash: deployHash });

  const [step, setStep] = useState<DeploymentStep>('form');
  const [formData, setFormData] = useState<FormData>({ 
    salt: '', 
    trustedIssuersAddress: '',
    claimTopicsAddress: '',
    identityStorageAddress: ''
  });
  const [deployedContract, setDeployedContract] = useState<DeployedContract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingBytecode, setIsLoadingBytecode] = useState(false);

  // Generate default salt
  React.useEffect(() => {
    if (userAddress && !formData.salt) {
      const defaultSalt = `IR_${Date.now()}_${userAddress.slice(-6)}`;
      setFormData(prev => ({ ...prev, salt: defaultSalt }));
    }
  }, [userAddress, formData.salt]);

  // Validate address format
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Validate form data
  const validateForm = (): boolean => {
    if (!isValidAddress(formData.trustedIssuersAddress)) {
      setError('Invalid TrustedIssuers Registry address format');
      return false;
    }
    if (!isValidAddress(formData.claimTopicsAddress)) {
      setError('Invalid ClaimTopics Registry address format');
      return false;
    }
    if (!isValidAddress(formData.identityStorageAddress)) {
      setError('Invalid IdentityStorage address format');
      return false;
    }
    return true;
  };

  // Handle deployment
  const handleDeploy = async () => {
    if (!userAddress || !chainId) {
      setError('Please connect your wallet');
      return;
    }

    if (!validateForm()) {
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
      const bytecode = await loadIdentityRegistryProxyBytecode();
      console.log('Bytecode loaded, length:', bytecode.length);
      
      setIsLoadingBytecode(false);

      // Step 3: Deploy contract using wagmi (4-parameter constructor)
      await deployContract({
        abi: identityregistryproxyAbi,
        bytecode: bytecode,
        args: [
          config.implementationAuthority as `0x${string}`,
          formData.trustedIssuersAddress as `0x${string}`,
          formData.claimTopicsAddress as `0x${string}`,
          formData.identityStorageAddress as `0x${string}`
        ]
      });

    } catch (error) {
      console.error('Deployment error:', error);
      setError(error instanceof Error ? error.message : 'Unknown deployment error');
      setStep('error');
      setIsLoadingBytecode(false);
    }
  };



  // Handle deployment success (single-step deployment)
  React.useEffect(() => {
    if (isDeploySuccess && deployReceipt && step === 'deploying') {
      const deployed: DeployedContract = {
        address: deployReceipt.contractAddress || '',
        transactionHash: deployReceipt.transactionHash,
        blockNumber: Number(deployReceipt.blockNumber)
      };
      setDeployedContract(deployed);
      setStep('success');
      console.log('Deployment successful, contract address:', deployed.address);
    }
  }, [isDeploySuccess, deployReceipt, step]);

  // Handle errors
  React.useEffect(() => {
    if (deployError && step === 'deploying') {
      setError(deployError.message);
      setStep('error');
    }
  }, [deployError, step]);

  const resetForm = () => {
    setStep('form');
    setError(null);
    setDeployedContract(null);
    setFormData({ 
      salt: '', 
      trustedIssuersAddress: '',
      claimTopicsAddress: '',
      identityStorageAddress: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Step 4 of 5: Identity Registry</h2>
            <p className="text-orange-100">Combines all registries into unified identity management</p>
          </div>
          <div className="bg-white text-orange-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            4
          </div>
        </div>
      </div>

      <div className="bg-white border-l border-r border-orange-200 p-6">
        {/* Prerequisites Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <h3 className="font-medium text-yellow-800">Prerequisites:</h3>
          <ul className="text-yellow-700 text-sm mt-1">
            <li>• Wallet connected to chain 420420420</li>
            <li>• Sufficient ETH balance for gas fees</li>
            <li>• TrustedIssuers Registry deployed (Step 1)</li>
            <li>• ClaimTopics Registry deployed (Step 2)</li>
            <li>• IdentityStorage deployed (Step 3)</li>
            <li>• Implementation Authority: 0x867fb...6F</li>
          </ul>
        </div>

        {/* Contract Purpose Explanation */}
        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">What this contract does:</h3>
          <p className="text-gray-600 text-sm mb-2">
            The IdentityRegistry is the central hub that combines all previous registries. 
            It provides a unified interface for identity verification, claim validation, 
            and storage management for T-REX tokens.
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Key functions:</span> Register identities, 
            validate claims against topics, check trusted issuers, manage user permissions.
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
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-6">
            <p className="text-orange-800">
              <span className="font-medium">Connected:</span> {userAddress} | 
              <span className="font-medium"> Chain:</span> {chainId}
            </p>
          </div>
        )}
        
        {/* Form Step */}
        {step === 'form' && (
          <div className="border border-gray-200 rounded-lg p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleDeploy(); }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TrustedIssuers Registry Address *
                  </label>
                  <input
                    type="text"
                    value={formData.trustedIssuersAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, trustedIssuersAddress: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0x... (from Step 1)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ClaimTopics Registry Address *
                  </label>
                  <input
                    type="text"
                    value={formData.claimTopicsAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, claimTopicsAddress: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0x... (from Step 2)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IdentityStorage Address *
                  </label>
                  <input
                    type="text"
                    value={formData.identityStorageAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, identityStorageAddress: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0x... (from Step 3)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deployment Salt (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.salt}
                    onChange={(e) => setFormData(prev => ({ ...prev, salt: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter unique deployment salt"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for deterministic contract addresses. Auto-generated if empty.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Deployment Details:</h3>
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Contract:</span> IdentityRegistryProxy
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Process:</span> Single deployment with constructor parameters
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Purpose:</span> Central hub for identity verification
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
                disabled={!userAddress || isDeployPending || !formData.trustedIssuersAddress || !formData.claimTopicsAddress || !formData.identityStorageAddress}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {!userAddress 
                  ? 'Connect Wallet First' 
                  : isDeployPending 
                    ? 'Deploying...' 
                    : 'Deploy Identity Registry'
                }
              </button>
            </form>
          </div>
        )}

        {/* Deploying Step */}
        {step === 'deploying' && (
          <div className="border border-orange-200 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              {isLoadingBytecode ? 'Loading Contract Bytecode...' : 'Deploying Registry...'}
            </h3>
            <p className="text-orange-700">
              {isLoadingBytecode 
                ? 'Importing contract artifacts from T-REX directory...'
                : isDeployConfirming 
                  ? 'Waiting for deployment confirmation...' 
                  : 'Please confirm the deployment transaction in your wallet.'
              }
            </p>
            
            {deployHash && (
              <div className="mt-4 bg-orange-50 rounded-md p-3">
                <p className="text-xs text-orange-600">
                  <span className="font-medium">Deploy Transaction Hash:</span>
                </p>
                <code className="text-xs text-orange-800 break-all">{deployHash}</code>
              </div>
            )}
          </div>
        )}



        {/* Success Step */}
        {step === 'success' && deployedContract && (
          <div className="border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Identity Registry Deployed Successfully!
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
                This is your deployed IdentityRegistry contract address!
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 text-left">
              <h4 className="font-medium text-green-900 mb-2">Deployment Details</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>
                  <span className="font-medium">Transaction Hash:</span>{' '}
                  <code className="text-xs">{deployedContract.transactionHash}</code>
                </div>
                <div><span className="font-medium">Block Number:</span> {deployedContract.blockNumber}</div>
                <div><span className="font-medium">Chain ID:</span> {chainId}</div>
                <div><span className="font-medium">Deployer:</span> {userAddress}</div>
              </div>
            </div>

            {/* Registry Configuration */}
            <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-4 text-left">
              <h4 className="font-medium text-orange-900 mb-2">Registry Configuration</h4>
              <div className="text-sm text-orange-700 space-y-1">
                <div><span className="font-medium">TrustedIssuers:</span> {formData.trustedIssuersAddress}</div>
                <div><span className="font-medium">ClaimTopics:</span> {formData.claimTopicsAddress}</div>
                <div><span className="font-medium">IdentityStorage:</span> {formData.identityStorageAddress}</div>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-4">
              <h4 className="font-medium text-orange-900 mb-2">✅ Next Steps:</h4>
              <ul className="text-orange-800 text-sm text-left space-y-1">
                <li>• Copy the deployed contract address above</li>
                <li>• Proceed to Step 5: Token deployment (final step!)</li>
                <li>• This IdentityRegistry will be used in token deployment</li>
                <li>• After setup: register identities and manage claims</li>
              </ul>
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
                <li>• Invalid registry addresses (check format)</li>
                <li>• Network connectivity issues</li>
                <li>• Wallet transaction rejected</li>
                <li>• Missing prerequisites (Steps 1-3 not completed)</li>
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
      <div className="bg-gray-50 border border-t-0 border-orange-200 rounded-b-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Progress: Step 4 of 5</span>
          <div className="flex space-x-1">
            <div className="w-8 h-2 bg-blue-500 rounded" title="Step 1: TrustedIssuers"></div>
            <div className="w-8 h-2 bg-purple-500 rounded" title="Step 2: ClaimTopics"></div>
            <div className="w-8 h-2 bg-green-500 rounded" title="Step 3: IdentityStorage"></div>
            <div className="w-8 h-2 bg-orange-500 rounded" title="Step 4: IdentityRegistry (Current)"></div>
            <div className="w-8 h-2 bg-gray-200 rounded" title="Step 5: Token"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
