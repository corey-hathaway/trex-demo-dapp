import React, { useState } from 'react';
import { useAccount, useDeployContract, useWaitForTransactionReceipt } from 'wagmi';
import { defaultComplianceAbi } from '../generated';
import { loadDefaultComplianceBytecode } from '../utils/loadContractBytecode';

interface FormData {
  salt: string;
}

interface DeployedContract {
  address: string;
  transactionHash: string;
  blockNumber: number;
}

type DeploymentStep = 'form' | 'deploying' | 'success' | 'error';

interface DefaultComplianceDeploymentProps {
  onComplete?: () => void;
}

export function DefaultComplianceDeployment({ onComplete }: DefaultComplianceDeploymentProps) {
  const { address: userAddress, chainId } = useAccount();
  const { deployContract, data: deployHash, error: deployError, isPending: isDeployPending } = useDeployContract();
  const { isLoading: isDeployConfirming, isSuccess: isDeploySuccess, data: deployReceipt } = useWaitForTransactionReceipt({ hash: deployHash });

  const [step, setStep] = useState<DeploymentStep>('form');
  const [formData, setFormData] = useState<FormData>({ salt: '' });
  const [deployedContract, setDeployedContract] = useState<DeployedContract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingBytecode, setIsLoadingBytecode] = useState(false);

  // Generate default salt
  React.useEffect(() => {
    if (userAddress && !formData.salt) {
      const defaultSalt = `DC_${Date.now()}_${userAddress.slice(-6)}`;
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

      console.log('Deploying DefaultCompliance...');

      // Step 1: Load contract bytecode dynamically
      const bytecode = await loadDefaultComplianceBytecode();
      console.log('Bytecode loaded, length:', bytecode.length);
      
      setIsLoadingBytecode(false);

      // Step 2: Deploy contract (no constructor parameters needed)
      await deployContract({
        abi: defaultComplianceAbi,
        bytecode: bytecode,
        args: [] // DefaultCompliance has no constructor parameters
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
      console.log('DefaultCompliance deployment successful, contract address:', deployed.address);
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
    setFormData({ salt: '' });
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Step 5 of 6: Default Compliance</h2>
            <p className="text-red-100">Simple compliance contract allowing all transfers</p>
          </div>
          <div className="bg-white text-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            5
          </div>
        </div>
      </div>

      <div className="bg-white border-l border-r border-red-200 p-6">
        {/* Prerequisites Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <h3 className="font-medium text-yellow-800">Prerequisites:</h3>
          <ul className="text-yellow-700 text-sm mt-1">
            <li>• Wallet connected to chain 420420420</li>
            <li>• Sufficient ETH balance for gas fees</li>
            <li>• No dependencies (can deploy independently)</li>
          </ul>
        </div>

        {/* Contract Purpose Explanation */}
        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">What this contract does:</h3>
          <p className="text-gray-600 text-sm mb-2">
            DefaultCompliance is a simple compliance contract that allows all token transfers 
            without restrictions. It provides the basic compliance interface required by 
            T-REX tokens while implementing no actual rules.
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Use case:</span> Development, testing, or tokens 
            that don't require transfer restrictions. Can be upgraded to ModularCompliance later.
          </p>
        </div>

        {/* Simplicity Notice */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <h3 className="font-medium text-green-800">✅ Simple Deployment:</h3>
          <p className="text-green-700 text-sm">
            This is the simplest component in the wizard! DefaultCompliance requires no configuration 
            or dependencies - just deploy and use. Perfect for getting started quickly.
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
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    <span className="font-medium">Contract:</span> DefaultCompliance
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Process:</span> Direct deployment (no proxy)
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Purpose:</span> Allow all transfers without restrictions
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
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {!userAddress 
                  ? 'Connect Wallet First' 
                  : isDeployPending 
                    ? 'Deploying...' 
                    : 'Deploy Default Compliance'
                }
              </button>
            </form>
          </div>
        )}

        {/* Deploying Step */}
        {step === 'deploying' && (
          <div className="border border-red-200 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {isLoadingBytecode ? 'Loading Contract Bytecode...' : 'Deploying Compliance...'}
            </h3>
            <p className="text-red-700">
              {isLoadingBytecode 
                ? 'Importing contract artifacts from T-REX directory...'
                : isDeployConfirming 
                  ? 'Waiting for deployment confirmation...' 
                  : 'Please confirm the deployment transaction in your wallet.'
              }
            </p>
            
            {deployHash && (
              <div className="mt-4 bg-red-50 rounded-md p-3">
                <p className="text-xs text-red-600">
                  <span className="font-medium">Transaction Hash:</span>
                </p>
                <code className="text-xs text-red-800 break-all">{deployHash}</code>
              </div>
            )}
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && deployedContract && (
          <div className="border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Default Compliance Deployed Successfully!
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
                This is your deployed DefaultCompliance contract address!
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

            {/* Compliance Features */}
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 text-left">
              <h4 className="font-medium text-red-900 mb-2">Compliance Features</h4>
              <div className="text-sm text-red-700 space-y-1">
                <div>• <span className="font-medium">Transfer Policy:</span> Allows all transfers</div>
                <div>• <span className="font-medium">Restrictions:</span> None (wide open)</div>
                <div>• <span className="font-medium">Rules:</span> No compliance rules enforced</div>
                <div>• <span className="font-medium">Upgrade Path:</span> Can switch to ModularCompliance</div>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <h4 className="font-medium text-red-900 mb-2">✅ Next Steps:</h4>
              <ul className="text-red-800 text-sm text-left space-y-1">
                <li>• Copy the deployed contract address above</li>
                <li>• Proceed to Step 6: Token deployment (final step!)</li>
                <li>• This compliance contract will be used in token deployment</li>
                <li>• Consider upgrading to ModularCompliance for production use</li>
              </ul>
            </div>

            <button
              onClick={resetForm}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
                <li>• Bytecode compilation/loading error</li>
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
      <div className="bg-gray-50 border border-t-0 border-red-200 rounded-b-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Progress: Step 5 of 6</span>
          <div className="flex space-x-1">
            <div className="w-8 h-2 bg-blue-500 rounded" title="Step 1: TrustedIssuers"></div>
            <div className="w-8 h-2 bg-purple-500 rounded" title="Step 2: ClaimTopics"></div>
            <div className="w-8 h-2 bg-green-500 rounded" title="Step 3: IdentityStorage"></div>
            <div className="w-8 h-2 bg-orange-500 rounded" title="Step 4: IdentityRegistry"></div>
            <div className="w-8 h-2 bg-red-500 rounded" title="Step 5: Compliance (Current)"></div>
            <div className="w-8 h-2 bg-gray-200 rounded" title="Step 6: Token"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
