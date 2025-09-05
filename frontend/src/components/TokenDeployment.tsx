import React, { useState } from 'react';
import { useAccount, useDeployContract, useWaitForTransactionReceipt } from 'wagmi';
import { tokenproxyAbi } from '../generated';
import { loadTokenProxyBytecode } from '../utils/loadContractBytecode';
import { getDeploymentConfig, validateDeploymentConfig } from '../utils/deploymentConfig';

interface TokenFormData {
  name: string;
  symbol: string;
  decimals: number;
  identityRegistryAddress: string;
  complianceAddress: string;
  onchainID: string;
  salt: string;
}

interface DeployedContract {
  address: string;
  transactionHash: string;
  blockNumber: number;
}

type DeploymentStep = 'form' | 'deploying' | 'success' | 'error';

interface TokenDeploymentProps {
  onComplete?: () => void;
}

export function TokenDeployment({ onComplete }: TokenDeploymentProps) {
  const { address: userAddress, chainId } = useAccount();
  const { deployContract, data: deployHash, error: deployError, isPending: isDeployPending } = useDeployContract();
  const { isLoading: isDeployConfirming, isSuccess: isDeploySuccess, data: deployReceipt } = useWaitForTransactionReceipt({ hash: deployHash });

  const [step, setStep] = useState<DeploymentStep>('form');
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    decimals: 18,
    identityRegistryAddress: '',
    complianceAddress: '',
    onchainID: '0x0000000000000000000000000000000000000000',
    salt: ''
  });
  const [deployedContract, setDeployedContract] = useState<DeployedContract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingBytecode, setIsLoadingBytecode] = useState(false);

  // Generate default salt
  React.useEffect(() => {
    if (userAddress && !formData.salt) {
      const defaultSalt = `TOKEN_${Date.now()}_${userAddress.slice(-6)}`;
      setFormData(prev => ({ ...prev, salt: defaultSalt }));
    }
  }, [userAddress, formData.salt]);

  // Form validation
  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Token name is required';
    if (!formData.symbol.trim()) return 'Token symbol is required';
    if (formData.decimals < 0 || formData.decimals > 18) return 'Decimals must be between 0 and 18';
    if (!formData.identityRegistryAddress.trim()) return 'Identity Registry address is required';
    if (!formData.complianceAddress.trim()) return 'Compliance address is required';
    
    // Basic address validation
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(formData.identityRegistryAddress)) return 'Invalid Identity Registry address format';
    if (!addressRegex.test(formData.complianceAddress)) return 'Invalid Compliance address format';
    if (formData.onchainID !== '0x0000000000000000000000000000000000000000' && !addressRegex.test(formData.onchainID)) {
      return 'Invalid OnchainID address format';
    }

    return null;
  };

  // Handle deployment
  const handleDeploy = async () => {
    if (!userAddress || !chainId) {
      setError('Please connect your wallet');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setStep('deploying');
      setError(null);
      setIsLoadingBytecode(true);

      console.log('Deploying TokenProxy...');

      // Step 1: Get deployment configuration
      const config = getDeploymentConfig(chainId);
      if (!validateDeploymentConfig(config)) {
        throw new Error(`No deployment configuration found for chain ${chainId}`);
      }

      // Step 2: Load contract bytecode dynamically
      const bytecode = await loadTokenProxyBytecode();
      console.log('Bytecode loaded, length:', bytecode.length);
      
      setIsLoadingBytecode(false);

      // Step 3: Deploy TokenProxy with all constructor parameters
      await deployContract({
        abi: tokenproxyAbi,
        bytecode: bytecode,
        args: [
          config.implementationAuthority as `0x${string}`,  // implementationAuthority
          formData.identityRegistryAddress as `0x${string}`, // _identityRegistry
          formData.complianceAddress as `0x${string}`,       // _compliance
          formData.name,                                      // _name
          formData.symbol,                                    // _symbol
          formData.decimals,                                  // _decimals
          formData.onchainID as `0x${string}`                // _onchainID
        ]
      });

    } catch (error) {
      console.error('Deployment error:', error);
      setError(error instanceof Error ? error.message : 'Unknown deployment error');
      setStep('error');
      setIsLoadingBytecode(false);
    }
  };

  // Handle deployment success
  React.useEffect(() => {
    if (isDeploySuccess && deployReceipt && step === 'deploying') {
      const deployed: DeployedContract = {
        address: deployReceipt.contractAddress || '',
        transactionHash: deployReceipt.transactionHash,
        blockNumber: Number(deployReceipt.blockNumber)
      };
      setDeployedContract(deployed);
      setStep('success');
      onComplete?.();
      console.log('TokenProxy deployment successful, contract address:', deployed.address);
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
      name: '',
      symbol: '',
      decimals: 18,
      identityRegistryAddress: '',
      complianceAddress: '',
      onchainID: '0x0000000000000000000000000000000000000000',
      salt: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Step 6 of 6: Token Contract</h2>
            <p className="text-purple-100">Deploy your ERC-3643 security token</p>
          </div>
          <div className="bg-white text-purple-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            6
          </div>
        </div>
      </div>

      <div className="bg-white border-l border-r border-purple-200 p-6">
        {/* Prerequisites Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <h3 className="font-medium text-yellow-800">Prerequisites:</h3>
          <ul className="text-yellow-700 text-sm mt-1">
            <li>• Wallet connected to chain 420420420</li>
            <li>• Sufficient ETH balance for gas fees</li>
            <li>• Identity Registry deployed (Step 4)</li>
            <li>• Compliance contract deployed (Step 5)</li>
          </ul>
        </div>

        {/* Contract Purpose Explanation */}
        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">What this contract does:</h3>
          <p className="text-gray-600 text-sm mb-2">
            TokenProxy creates an ERC-3643 compliant security token that enforces identity 
            verification and compliance rules on all transfers. This is the final piece 
            that connects all your deployed infrastructure.
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Features:</span> KYC/AML compliance, transfer restrictions, 
            agent roles, pausable transfers, and full ERC-20 compatibility.
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
          <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-6">
            <p className="text-purple-800">
              <span className="font-medium">Connected:</span> {userAddress} | 
              <span className="font-medium"> Chain:</span> {chainId}
            </p>
          </div>
        )}
        
        {/* Form Step */}
        {step === 'form' && (
          <div className="border border-gray-200 rounded-lg p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleDeploy(); }}>
              {/* Token Configuration */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Token Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Token Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="My Security Token"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Token Symbol *
                    </label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="MST"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decimals *
                  </label>
                  <select
                    value={formData.decimals}
                    onChange={(e) => setFormData(prev => ({ ...prev, decimals: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {Array.from({ length: 19 }, (_, i) => (
                      <option key={i} value={i}>{i} decimals</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Number of decimal places (18 is standard for most tokens)
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OnchainID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.onchainID}
                    onChange={(e) => setFormData(prev => ({ ...prev, onchainID: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0x0000000000000000000000000000000000000000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Identity contract for the token itself (can be set later)
                  </p>
                </div>
              </div>

              {/* Contract Dependencies */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Contract Dependencies</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identity Registry Address * (from Step 4)
                  </label>
                  <input
                    type="text"
                    value={formData.identityRegistryAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, identityRegistryAddress: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0x..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Address of the IdentityRegistry contract deployed in Step 4
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compliance Address * (from Step 5)
                  </label>
                  <input
                    type="text"
                    value={formData.complianceAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, complianceAddress: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0x..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Address of the DefaultCompliance contract deployed in Step 5
                  </p>
                </div>
              </div>

              {/* Deployment Salt */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deployment Salt (Optional)
                </label>
                <input
                  type="text"
                  value={formData.salt}
                  onChange={(e) => setFormData(prev => ({ ...prev, salt: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter unique deployment salt"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for deterministic contract addresses. Auto-generated if empty.
                </p>
              </div>

              {/* Deployment Details */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Deployment Details:</h3>
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Contract:</span> TokenProxy (ERC-3643)
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Process:</span> Single deployment with all parameters
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Features:</span> Compliance enforcement, identity verification, agent roles
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Initial State:</span> Token will be paused (owner must unpause)
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
                disabled={!userAddress || isDeployPending}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {!userAddress 
                  ? 'Connect Wallet First' 
                  : isDeployPending 
                    ? 'Deploying...' 
                    : 'Deploy T-REX Token'
                }
              </button>
            </form>
          </div>
        )}

        {/* Deploying Step */}
        {step === 'deploying' && (
          <div className="border border-purple-200 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              {isLoadingBytecode ? 'Loading Contract Bytecode...' : 'Deploying Token...'}
            </h3>
            <p className="text-purple-700">
              {isLoadingBytecode 
                ? 'Importing TokenProxy artifacts from T-REX directory...'
                : isDeployConfirming 
                  ? 'Waiting for deployment confirmation...' 
                  : 'Please confirm the deployment transaction in your wallet.'
              }
            </p>
            
            {deployHash && (
              <div className="mt-4 bg-purple-50 rounded-md p-3">
                <p className="text-xs text-purple-600">
                  <span className="font-medium">Transaction Hash:</span>
                </p>
                <code className="text-xs text-purple-800 break-all">{deployHash}</code>
              </div>
            )}
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && deployedContract && (
          <div className="border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-500 text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              T-REX Token Deployed Successfully!
            </h3>
            
            {/* Token Address Highlight */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-md p-4 mb-4">
              <h4 className="font-bold text-blue-900 mb-2">🪙 Token Contract Address</h4>
              <div className="bg-white border border-blue-200 rounded p-3">
                <code className="text-lg font-mono text-blue-800 break-all">
                  {deployedContract.address}
                </code>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                This is your deployed T-REX security token address!
              </p>
            </div>

            {/* Token Details */}
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-4 text-left">
              <h4 className="font-medium text-purple-900 mb-2">Token Information</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <div><span className="font-medium">Name:</span> {formData.name}</div>
                <div><span className="font-medium">Symbol:</span> {formData.symbol}</div>
                <div><span className="font-medium">Decimals:</span> {formData.decimals}</div>
                <div><span className="font-medium">Standard:</span> ERC-3643 Security Token</div>
                <div><span className="font-medium">Status:</span> Paused (requires unpausing)</div>
              </div>
            </div>

            {/* Deployment Details */}
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

            {/* Contract Configuration */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">Contract Configuration</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <span className="font-medium">Identity Registry:</span>{' '}
                  <code className="text-xs">{formData.identityRegistryAddress}</code>
                </div>
                <div>
                  <span className="font-medium">Compliance:</span>{' '}
                  <code className="text-xs">{formData.complianceAddress}</code>
                </div>
                <div>
                  <span className="font-medium">OnchainID:</span>{' '}
                  <code className="text-xs">{formData.onchainID}</code>
                </div>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-4">
              <h4 className="font-medium text-purple-900 mb-2">🎯 Next Steps:</h4>
              <ul className="text-purple-800 text-sm text-left space-y-1">
                <li>• Your T-REX token is now deployed and ready!</li>
                <li>• Token starts paused - call unpause() when ready</li>
                <li>• Add token agents for administrative functions</li>
                <li>• Mint initial tokens to verified identities</li>
                <li>• Configure additional compliance rules if needed</li>
              </ul>
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Deploy Another Token
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
                <li>• Invalid contract addresses (Steps 4-5)</li>
                <li>• Network connectivity issues</li>
                <li>• Wallet transaction rejected</li>
                <li>• Token name/symbol validation errors</li>
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
      <div className="bg-gray-50 border border-t-0 border-purple-200 rounded-b-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Progress: Step 6 of 6 (Complete!)</span>
          <div className="flex space-x-1">
            <div className="w-8 h-2 bg-blue-500 rounded" title="Step 1: TrustedIssuers"></div>
            <div className="w-8 h-2 bg-purple-500 rounded" title="Step 2: ClaimTopics"></div>
            <div className="w-8 h-2 bg-green-500 rounded" title="Step 3: IdentityStorage"></div>
            <div className="w-8 h-2 bg-orange-500 rounded" title="Step 4: IdentityRegistry"></div>
            <div className="w-8 h-2 bg-red-500 rounded" title="Step 5: Compliance"></div>
            <div className="w-8 h-2 bg-purple-500 rounded" title="Step 6: Token (Current)"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
