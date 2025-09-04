import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { tokenAbi } from '../generated';



export function AgentManagement() {
  const { address: userAddress, chainId } = useAccount();
  const { writeContract, data: txHash, error: writeError, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [agentAddress, setAgentAddress] = useState('');
  const [tokenAddressInput, setTokenAddressInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use only the user-provided token address
  const targetTokenAddress = tokenAddressInput;

  // Check if user is token owner/agent
  const { data: isUserAgent } = useReadContract({
    address: targetTokenAddress,
    abi: tokenAbi,
    functionName: 'isAgent',
    args: [userAddress as `0x${string}`],
    query: {
      enabled: !!userAddress && !!targetTokenAddress,
    },
  });

  // Validate address format
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Handle adding agent
  const handleAddAgent = async () => {
    if (!userAddress) {
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

    if (!agentAddress.trim()) {
      setError('Agent address is required');
      return;
    }

    if (!isValidAddress(agentAddress)) {
      setError('Invalid agent address format');
      return;
    }

    // Note: Owner can also be an agent - T-REX allows this and it's often useful

    try {
      setError(null);
      setIsLoading(true);

      console.log('Adding agent:', agentAddress);

      await writeContract({
        address: targetTokenAddress,
        abi: tokenAbi,
        functionName: 'addAgent',
        args: [agentAddress as `0x${string}`] // Only agent address needed
      });

    } catch (error) {
      console.error('Add agent error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error adding agent');
      setIsLoading(false);
    }
  };

  // Handle transaction success
  React.useEffect(() => {
    if (isTxSuccess && txHash) {
      setAgentAddress('');
      setError(null);
      setIsLoading(false);
      console.log('Agent added successfully, transaction hash:', txHash);
    }
  }, [isTxSuccess, txHash]);

  // Handle transaction errors
  React.useEffect(() => {
    if (writeError) {
      setError(writeError.message);
      setIsLoading(false);
    }
  }, [writeError]);

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Agent Management</h2>
            <p className="text-indigo-100">Add agents to manage your T-REX token</p>
          </div>
          <div className="bg-white text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            🔐
          </div>
        </div>
      </div>

      <div className="bg-white border-l border-r border-indigo-200 p-6">
        {/* Prerequisites Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <h3 className="font-medium text-yellow-800">Prerequisites:</h3>
          <ul className="text-yellow-700 text-sm mt-1">
            <li>• Wallet connected as token owner</li>
            <li>• T-REX token deployed (Step 6 completed)</li>
            <li>• Agent address ready to add</li>
          </ul>
        </div>

        {/* Agent Purpose Explanation */}
        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">What agents can do:</h3>
          <p className="text-gray-600 text-sm mb-2">
            Agents have operational permissions including pausing/unpausing transfers, 
            minting tokens, burning tokens, forced transfers, and freezing addresses. 
            These are different from owner permissions (configuration, compliance setup).
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Note:</span> T-REX uses a simple agent system - once added, 
            agents have full operational permissions. The owner should typically add themselves as an agent.
          </p>
        </div>

        {/* Connection Status */}
        {!userAddress && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800">Please connect your wallet to manage agents.</p>
          </div>
        )}





        {/* Chain Info */}
        {userAddress && chainId && targetTokenAddress && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 mb-6">
            <p className="text-indigo-800">
              <span className="font-medium">Connected:</span> {userAddress} | 
              <span className="font-medium"> Chain:</span> {chainId} |
              <span className="font-medium"> Token:</span> {targetTokenAddress}
            </p>
          </div>
        )}
        
        {/* Add Agent Form */}
        {userAddress && (
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Agent</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Address *
              </label>
              <input
                type="text"
                value={tokenAddressInput}
                onChange={(e) => setTokenAddressInput(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0x... (Enter T-REX token address)"
                disabled={isLoading || isWritePending || isConfirming}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the T-REX token contract address
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Address *
              </label>
              <input
                type="text"
                value={agentAddress}
                onChange={(e) => setAgentAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0x..."
                disabled={isLoading || isWritePending || isConfirming}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the wallet address that should become an agent
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Transaction Status */}
            {(isWritePending || isConfirming) && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <p className="text-blue-700 text-sm">
                    {isWritePending ? 'Please confirm transaction in wallet...' : 'Waiting for confirmation...'}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {isTxSuccess && txHash && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <p className="text-green-700 text-sm font-medium">✅ Agent added successfully!</p>
                <p className="text-green-600 text-xs mt-1">Transaction: {txHash}</p>
              </div>
            )}

            <button
              onClick={handleAddAgent}
              disabled={!userAddress || !targetTokenAddress || isLoading || isWritePending || isConfirming || !agentAddress}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {!userAddress 
                ? 'Connect Wallet First' 
                : !targetTokenAddress
                  ? 'Enter Token Address'
                  : isWritePending || isConfirming
                    ? 'Adding Agent...' 
                    : 'Add Agent'
              }
            </button>
          </div>
        )}

        {/* Quick Add Self Button */}
        {userAddress && targetTokenAddress && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 mb-2">Quick Action:</h4>
            <p className="text-indigo-700 text-sm mb-2">
              Add yourself as an agent to perform operational functions (recommended for token owners):
            </p>
            <button
              onClick={() => setAgentAddress(userAddress)}
              disabled={isLoading || isWritePending || isConfirming}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
            >
              Use My Address ({userAddress?.slice(0, 6)}...{userAddress?.slice(-4)})
            </button>
          </div>
        )}
      </div>

      {/* Progress Footer */}
      <div className="bg-gray-50 border border-t-0 border-indigo-200 rounded-b-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Token Management: Agent Setup</span>
          <div className="text-indigo-600 font-medium">
            Next: Test token operations
          </div>
        </div>
      </div>
    </div>
  );
}
