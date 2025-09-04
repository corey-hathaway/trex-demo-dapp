import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { trustedIssuersRegistryAbi } from '../generated';

interface TrustedIssuer {
  address: string;
  topics: number[];
  description?: string;
}

export function ClaimIssuerManagement() {
  const { address: userAddress, chainId } = useAccount();
  const { writeContract, data: txHash, error: writeError, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [registryAddress, setRegistryAddress] = useState('');
  const [issuerAddress, setIssuerAddress] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [issuerDescription, setIssuerDescription] = useState('');
  const [removeIssuerAddress, setRemoveIssuerAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');

  // Validate address format
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Predefined claim topics (can be expanded)
  const claimTopics = [
    { id: 1, name: 'Identity Verification', description: 'KYC/Identity claims' },
    { id: 2, name: 'AML Screening', description: 'Anti-money laundering checks' },
    { id: 3, name: 'Accredited Investor', description: 'Investment qualification' },
    { id: 4, name: 'Jurisdiction', description: 'Geographic/legal jurisdiction' },
    { id: 42, name: 'Age Verification', description: 'Age/majority verification' },
  ];

  // Check if address is trusted issuer
  const { data: isTrustedIssuer } = useReadContract({
    address: registryAddress as `0x${string}`,
    abi: trustedIssuersRegistryAbi,
    functionName: 'isTrustedIssuer',
    args: [issuerAddress as `0x${string}`],
    query: {
      enabled: !!registryAddress && !!issuerAddress && isValidAddress(issuerAddress),
    },
  });

  // Handle topic selection
  const toggleTopic = (topicId: number) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Handle adding trusted issuer
  const handleAddIssuer = async () => {
    if (!userAddress) {
      setError('Please connect your wallet');
      return;
    }

    if (!registryAddress) {
      setError('TrustedIssuers Registry address is required');
      return;
    }

    if (!isValidAddress(registryAddress)) {
      setError('Invalid registry address format');
      return;
    }

    if (!issuerAddress.trim()) {
      setError('Issuer address is required');
      return;
    }

    if (!isValidAddress(issuerAddress)) {
      setError('Invalid issuer address format');
      return;
    }

    if (selectedTopics.length === 0) {
      setError('At least one claim topic must be selected');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      console.log('Adding trusted issuer:', issuerAddress, 'for topics:', selectedTopics);

      await writeContract({
        address: registryAddress as `0x${string}`,
        abi: trustedIssuersRegistryAbi,
        functionName: 'addTrustedIssuer',
        args: [issuerAddress as `0x${string}`, selectedTopics]
      });

    } catch (error) {
      console.error('Add issuer error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error adding issuer');
      setIsLoading(false);
    }
  };

  // Handle removing trusted issuer
  const handleRemoveIssuer = async () => {
    if (!userAddress) {
      setError('Please connect your wallet');
      return;
    }

    if (!registryAddress) {
      setError('TrustedIssuers Registry address is required');
      return;
    }

    if (!isValidAddress(registryAddress)) {
      setError('Invalid registry address format');
      return;
    }

    if (!removeIssuerAddress.trim()) {
      setError('Issuer address is required');
      return;
    }

    if (!isValidAddress(removeIssuerAddress)) {
      setError('Invalid issuer address format');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      console.log('Removing trusted issuer:', removeIssuerAddress);

      await writeContract({
        address: registryAddress as `0x${string}`,
        abi: trustedIssuersRegistryAbi,
        functionName: 'removeTrustedIssuer',
        args: [removeIssuerAddress as `0x${string}`]
      });

    } catch (error) {
      console.error('Remove issuer error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error removing issuer');
      setIsLoading(false);
    }
  };

  // Handle transaction success
  React.useEffect(() => {
    if (isTxSuccess && txHash) {
      setIssuerAddress('');
      setSelectedTopics([]);
      setIssuerDescription('');
      setRemoveIssuerAddress('');
      setError(null);
      setIsLoading(false);
      console.log('Issuer operation successful, transaction hash:', txHash);
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
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Claim Issuer Management</h2>
            <p className="text-green-100">Manage trusted identity verification providers</p>
          </div>
          <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            🔐
          </div>
        </div>
      </div>

      <div className="bg-white border-l border-r border-green-200 p-6">
        {/* Prerequisites Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <h3 className="font-medium text-yellow-800">Prerequisites:</h3>
          <ul className="text-yellow-700 text-sm mt-1">
            <li>• Wallet connected as registry owner</li>
            <li>• TrustedIssuers Registry deployed (Step 1)</li>
            <li>• Claim issuer OnChain ID addresses ready</li>
          </ul>
        </div>

        {/* Claim Issuer Purpose Explanation */}
        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-2">What claim issuers do:</h3>
          <p className="text-gray-600 text-sm mb-2">
            Claim issuers are trusted third-party entities (KYC providers, compliance firms, 
            accreditation services) that verify user identities and issue digital claims. 
            Only claims from trusted issuers are accepted for token transfers.
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Examples:</span> Jumio (identity), Thomson Reuters (sanctions), 
            accreditation authorities, regulatory bodies.
          </p>
        </div>

        {/* Connection Status */}
        {!userAddress && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800">Please connect your wallet to manage claim issuers.</p>
          </div>
        )}

        {/* Registry Address Input */}
        {userAddress && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TrustedIssuers Registry Address *
            </label>
            <input
              type="text"
              value={registryAddress}
              onChange={(e) => setRegistryAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0x... (from Step 1 deployment)"
              disabled={isLoading || isWritePending || isConfirming}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the TrustedIssuersRegistry contract address from Step 1
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        {userAddress && registryAddress && (
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('add')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Add Trusted Issuer
              </button>
              <button
                onClick={() => setActiveTab('remove')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'remove'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Remove Trusted Issuer
              </button>
            </div>
          </div>
        )}

        {/* Add Issuer Tab */}
        {userAddress && registryAddress && activeTab === 'add' && (
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Trusted Issuer</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuer Address * (OnChain ID)
              </label>
              <input
                type="text"
                value={issuerAddress}
                onChange={(e) => setIssuerAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0x... (issuer's OnChain ID address)"
                disabled={isLoading || isWritePending || isConfirming}
              />
              <p className="text-xs text-gray-500 mt-1">
                The OnChain ID contract address of the claim issuer
              </p>
              {isTrustedIssuer && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ This issuer is already trusted
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                value={issuerDescription}
                onChange={(e) => setIssuerDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Jumio KYC Provider"
                disabled={isLoading || isWritePending || isConfirming}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authorized Claim Topics * (select at least one)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {claimTopics.map((topic) => (
                  <div key={topic.id} className="flex items-start">
                    <input
                      type="checkbox"
                      id={`topic-${topic.id}`}
                      checked={selectedTopics.includes(topic.id)}
                      onChange={() => toggleTopic(topic.id)}
                      className="mt-1 mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      disabled={isLoading || isWritePending || isConfirming}
                    />
                    <label htmlFor={`topic-${topic.id}`} className="text-sm">
                      <span className="font-medium">{topic.name}</span>
                      <span className="text-gray-500 block text-xs">{topic.description}</span>
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selected topics: {selectedTopics.length > 0 ? selectedTopics.join(', ') : 'None'}
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
                    {isWritePending ? 'Please confirm transaction in wallet...' : 'Adding trusted issuer...'}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {isTxSuccess && txHash && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <p className="text-green-700 text-sm font-medium">✅ Trusted issuer added successfully!</p>
                <p className="text-green-600 text-xs mt-1">Transaction: {txHash}</p>
              </div>
            )}

            <button
              onClick={handleAddIssuer}
              disabled={!userAddress || !registryAddress || isLoading || isWritePending || isConfirming || !issuerAddress || selectedTopics.length === 0}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {!userAddress 
                ? 'Connect Wallet First' 
                : !registryAddress
                  ? 'Enter Registry Address'
                  : isWritePending || isConfirming
                    ? 'Adding Issuer...' 
                    : 'Add Trusted Issuer'
              }
            </button>
          </div>
        )}

        {/* Remove Issuer Tab */}
        {userAddress && registryAddress && activeTab === 'remove' && (
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Remove Trusted Issuer</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuer Address *
              </label>
              <input
                type="text"
                value={removeIssuerAddress}
                onChange={(e) => setRemoveIssuerAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="0x... (issuer to remove)"
                disabled={isLoading || isWritePending || isConfirming}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the address of the trusted issuer to remove
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <h4 className="font-medium text-red-800">⚠️ Warning:</h4>
              <p className="text-red-700 text-sm mt-1">
                Removing a trusted issuer will invalidate all existing claims from that issuer. 
                Users with claims only from this issuer may lose transfer privileges.
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
                    {isWritePending ? 'Please confirm transaction in wallet...' : 'Removing trusted issuer...'}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {isTxSuccess && txHash && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <p className="text-green-700 text-sm font-medium">✅ Trusted issuer removed successfully!</p>
                <p className="text-green-600 text-xs mt-1">Transaction: {txHash}</p>
              </div>
            )}

            <button
              onClick={handleRemoveIssuer}
              disabled={!userAddress || !registryAddress || isLoading || isWritePending || isConfirming || !removeIssuerAddress}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {!userAddress 
                ? 'Connect Wallet First' 
                : !registryAddress
                  ? 'Enter Registry Address'
                  : isWritePending || isConfirming
                    ? 'Removing Issuer...' 
                    : 'Remove Trusted Issuer'
              }
            </button>
          </div>
        )}
      </div>

      {/* Progress Footer */}
      <div className="bg-gray-50 border border-t-0 border-green-200 rounded-b-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Identity Infrastructure: Claim Issuer Setup</span>
          <div className="text-green-600 font-medium">
            Next: User identity registration
          </div>
        </div>
      </div>
    </div>
  );
}
