import React, { useState } from 'react';
import { useAccount, useDeployContract, useWaitForTransactionReceipt } from 'wagmi';
import { agentManagerAbi } from '../generated';
import { loadAgentManagerBytecode } from '../utils/loadContractBytecode';
import { uploadAgentManagerBytecode } from '../utils/polkadotDeployment';

interface AgentManagementProps {
  tokenAddress?: string;
  onAgentManagerDeployed?: (address: string) => void;
}

export function AgentManagement({ 
  tokenAddress: propTokenAddress,
  onAgentManagerDeployed 
}: AgentManagementProps = {}) {
  const { address: userAddress, chainId } = useAccount();
  
  // Agent Manager deployment hooks
  const { deployContract, data: deployHash, error: deployError, isPending: isDeployPending } = useDeployContract();
  const { isLoading: isDeployConfirming, isSuccess: isDeploySuccess, data: deployReceipt } = useWaitForTransactionReceipt({ hash: deployHash });

  // State management
  const [tokenAddressInput, setTokenAddressInput] = useState(propTokenAddress || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deployedAgentManager, setDeployedAgentManager] = useState<string | null>(null);
  
  // Two-step deployment state
  const [bytecodeUploaded, setBytecodeUploaded] = useState(false);
  const [uploadedCodeHash, setUploadedCodeHash] = useState<string | null>(null);
  const [deploymentStep, setDeploymentStep] = useState<'idle' | 'uploading' | 'uploaded' | 'deploying' | 'deployed'>('idle');

  // Use manual input or prop token address, with manual input taking priority
  const targetTokenAddress = tokenAddressInput || propTokenAddress || '';

  // Validate address format
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Handle bytecode upload step (reviveUpload)
  const handleUploadBytecode = async () => {
    if (!userAddress || !chainId) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setError(null);
      setDeploymentStep('uploading');

      console.log('=== Step 1: Polkadot Bytecode Upload (reviveUpload) ===');
      console.log('- Network:', 'Local Polkadot Asset Hub');
      console.log('- Chain ID:', chainId);
      console.log('- User address:', userAddress);

      // Load bytecode from local artifacts
      const bytecode = await loadAgentManagerBytecode();
      const sizeInBytes = (bytecode.length - 2) / 2;
      console.log('- Bytecode size:', sizeInBytes, 'bytes');
      console.log('- Size in KB:', (sizeInBytes / 1024).toFixed(2), 'KB');
      console.log('- Using reviveUpload to bypass size limits');

      // Upload bytecode to Polkadot storage using reviveApi.uploadCode
      // Note: This uses Alice development account for signing the upload transaction
      // The user will still sign the actual contract deployment in Step 2
      console.log('- Using Alice development account for bytecode upload (development only)');
      const codeHash = await uploadAgentManagerBytecode(bytecode);
      
      setUploadedCodeHash(codeHash);
      setBytecodeUploaded(true);
      setDeploymentStep('uploaded');
      
      console.log('✅ Step 1 complete - Bytecode uploaded with hash:', codeHash);

    } catch (error) {
      console.error('=== Bytecode Upload Error ===');
      console.error('Error details:', error);
      setError(error instanceof Error ? error.message : 'Bytecode upload failed');
      setDeploymentStep('idle');
    }
  };

  // Handle contract deployment step (using uploaded bytecode)
  const handleDeployContract = async () => {
    if (!userAddress || !chainId) {
      setError('Please connect your wallet');
      return;
    }

    if (!targetTokenAddress) {
      setError('Token address is required');
      return;
    }

    if (!isValidAddress(targetTokenAddress)) {
      setError('Invalid token address format');
      return;
    }

    if (!bytecodeUploaded || !uploadedCodeHash) {
      setError('Please upload bytecode first using Step 1');
      return;
    }

    try {
      setError(null);
      setDeploymentStep('deploying');

      console.log('=== Step 2: Contract Deployment ===');
      console.log('- Token address:', targetTokenAddress);
      console.log('- User address:', userAddress);
      console.log('- Chain ID:', chainId);
      console.log('- Using uploaded code hash:', uploadedCodeHash);

      // Load bytecode for wagmi deployment (still needed for ABI compatibility)
      const bytecode = await loadAgentManagerBytecode();
      console.log('- Deploying with pre-uploaded bytecode reference');

      // Set a timeout to detect if deployment hangs
      const deploymentTimeout = setTimeout(() => {
        console.warn('Contract deployment taking longer than expected...');
        setError('Contract deployment is taking longer than expected. Please check your wallet for pending transactions.');
      }, 60000); // 60 seconds

      const result = await deployContract({
        abi: agentManagerAbi,
        bytecode: bytecode as `0x${string}`,
        args: [targetTokenAddress as `0x${string}`]
      });

      clearTimeout(deploymentTimeout);
      console.log('✅ Step 2 complete - Contract deployment initiated, result:', result);

    } catch (error) {
      console.error('=== Contract Deployment Error ===');
      console.error('Error details:', error);
      setError(error instanceof Error ? error.message : 'Contract deployment failed');
      setDeploymentStep('uploaded'); // Allow retry from step 2
    }
  };

  // Handle Agent Manager deployment success
  React.useEffect(() => {
    if (isDeploySuccess && deployReceipt) {
      const deployedAddress = deployReceipt.contractAddress || '';
      setDeployedAgentManager(deployedAddress);
      setDeploymentStep('deployed');
      setError(null);
      setIsLoading(false);
      console.log('=== ✅ Agent Manager Deployment Complete ===');
      console.log('Contract address:', deployedAddress);
      console.log('Transaction hash:', deployReceipt.transactionHash);
      console.log('Code hash used:', uploadedCodeHash);
      
      if (onAgentManagerDeployed) {
        onAgentManagerDeployed(deployedAddress);
      }
    }
  }, [isDeploySuccess, deployReceipt, onAgentManagerDeployed, uploadedCodeHash]);

  // Handle Agent Manager deployment errors
  React.useEffect(() => {
    if (deployError) {
      console.error('Deployment error detected:', deployError);
      setError(deployError.message);
      setIsLoading(false);
    }
  }, [deployError]);

  // Reset loading state when deployment states change
  React.useEffect(() => {
    if (isDeployPending || isDeployConfirming) {
      setIsLoading(false); // wagmi handles the loading states
    }
  }, [isDeployPending, isDeployConfirming]);

  // Manual reset function for stuck states
  const resetDeploymentState = () => {
    setIsLoading(false);
    setError(null);
    setDeploymentStep('idle');
    setBytecodeUploaded(false);
    setUploadedCodeHash(null);
    console.log('Two-step deployment state manually reset');
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Agent Manager Deployment</h2>
            <p className="text-indigo-100">Deploy Agent Manager contract for enhanced agent operations</p>
          </div>
          <div className="bg-white text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            🏭
          </div>
        </div>
      </div>

      <div className="bg-white border-l border-r border-indigo-200 p-6">
        {/* Agent Manager Benefits */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <h3 className="font-medium text-blue-800">Agent Manager Benefits:</h3>
          <ul className="text-blue-700 text-sm mt-1">
            <li>• Role-based permissions (TransferManager, Freezer, SupplyModifier, etc.)</li>
            <li>• Enhanced agent operations with onchain identity verification</li>
            <li>• Centralized management for complex agent workflows</li>
            <li>• Required for advanced T-REX agent operations</li>
          </ul>
        </div>

        {/* ReviveUpload Process Info */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <h3 className="font-medium text-blue-800">🔧 ReviveUpload Two-Step Process (Development):</h3>
          <ol className="text-blue-700 text-sm mt-1 list-decimal list-inside">
            <li><strong>Upload Bytecode:</strong> Store AgentManager bytecode (~116KB) in Polkadot storage using Alice development account</li>
            <li><strong>Deploy Contract:</strong> Create contract instance using your wallet and the uploaded bytecode reference</li>
          </ol>
          <p className="text-blue-600 text-xs mt-2">
            This process bypasses the 49KB transaction size limit. Step 1 uses Alice (development account), Step 2 requires your wallet signature.
          </p>
        </div>

        {/* Connection Status */}
        {!userAddress && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800">Please connect your wallet to deploy Agent Manager.</p>
          </div>
        )}

        {/* Token Address Input */}
        {userAddress && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Address *
            </label>
            <input
              type="text"
              value={tokenAddressInput}
              onChange={(e) => setTokenAddressInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0x... (Enter T-REX token address)"
              disabled={isLoading || isDeployPending || isDeployConfirming}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the T-REX token contract address to deploy Agent Manager for
            </p>
          </div>
        )}


        {/* Deployment Status */}
        {deployedAgentManager && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <p className="text-green-700 text-sm font-medium">✅ Agent Manager Already Deployed!</p>
            <p className="text-green-600 text-xs mt-1 break-all">Address: {deployedAgentManager}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Deployment Progress */}
        {(deploymentStep !== 'idle' && deploymentStep !== 'deployed') && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <p className="text-blue-700 text-sm">
                  {deploymentStep === 'uploading' ? 'Uploading bytecode to Polkadot storage (reviveUpload)...' :
                   deploymentStep === 'uploaded' ? 'Bytecode uploaded! Ready to deploy contract.' :
                   deploymentStep === 'deploying' ? 'Deploying Agent Manager contract...' :
                   'Processing...'}
                </p>
              </div>
              <button
                onClick={resetDeploymentState}
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                Reset
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="mt-3 flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${['uploading', 'uploaded', 'deploying', 'deployed'].includes(deploymentStep) ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className="text-xs text-blue-600">Upload</div>
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className={`w-3 h-3 rounded-full ${['deploying', 'deployed'].includes(deploymentStep) ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className="text-xs text-blue-600">Deploy</div>
            </div>
          </div>
        )}

        {/* Bytecode Upload Status */}
        {bytecodeUploaded && uploadedCodeHash && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <p className="text-green-700 text-sm font-medium">✅ Step 1 Complete: Bytecode uploaded to Polkadot</p>
            <p className="text-green-600 text-xs mt-1 break-all">Code Hash: {uploadedCodeHash}</p>
          </div>
        )}

        {/* Step 1: Upload Bytecode Button */}
        {!bytecodeUploaded && (
          <button
            onClick={handleUploadBytecode}
            disabled={
              !userAddress || 
              deploymentStep === 'uploading'
            }
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium mb-4"
          >
            {!userAddress 
              ? 'Connect Wallet First' 
              : deploymentStep === 'uploading'
                ? 'Uploading Bytecode to Polkadot...' 
                : 'Step 1: Upload Bytecode (ReviveUpload)'
            }
          </button>
        )}

        {/* Step 2: Deploy Contract Button */}
        {bytecodeUploaded && (
          <button
            onClick={handleDeployContract}
            disabled={
              !userAddress || 
              !targetTokenAddress || 
              deploymentStep === 'deploying' ||
              isDeployPending || 
              isDeployConfirming || 
              !!deployedAgentManager
            }
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {!userAddress 
              ? 'Connect Wallet First' 
              : !targetTokenAddress
                ? 'Enter Token Address'
                : deployedAgentManager
                  ? 'Agent Manager Already Deployed'
                  : deploymentStep === 'deploying' || isDeployPending || isDeployConfirming
                    ? 'Deploying Agent Manager...' 
                    : 'Step 2: Deploy Agent Manager Contract'
            }
          </button>
        )}
      </div>

      {/* Progress Footer */}
      <div className="bg-gray-50 border border-t-0 border-indigo-200 rounded-b-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Step 7: Agent Manager Deployment</span>
          <div className="text-indigo-600 font-medium">
            {deployedAgentManager ? '✅ Ready for Enhanced Operations' : 'Deploy for Advanced Features'}
          </div>
        </div>
      </div>
    </div>
  );
}