import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { claimTopicsRegistryAbi } from '../generated';
import { keccak256, toBytes } from 'viem';

interface PredefinedTopic {
  name: string;
  description: string;
  hash: string;
  required: boolean;
}

const PREDEFINED_TOPICS: PredefinedTopic[] = [
  {
    name: "KYC_VERIFIED",
    description: "Know Your Customer verification completed",
    hash: keccak256(toBytes("KYC_VERIFIED")),
    required: true
  },
  {
    name: "AML_CLEARED", 
    description: "Anti-Money Laundering screening passed",
    hash: keccak256(toBytes("AML_CLEARED")),
    required: true
  },
  {
    name: "COUNTRY_VERIFIED",
    description: "Investor country/jurisdiction verified",
    hash: keccak256(toBytes("COUNTRY_VERIFIED")),
    required: false
  }
];

export function ClaimTopicsManagement() {
  const { address: userAddress, isConnected } = useAccount();
  const { writeContract, data: txHash, error: writeError, isPending: isWritePending } = useWriteContract();
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [claimTopicsRegistryAddress, setClaimTopicsRegistryAddress] = useState('');
  const [addedTopics, setAddedTopics] = useState<string[]>([]);
  const [pendingTopic, setPendingTopic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validate address format
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Check if topic exists in registry
  const { data: existingTopics, refetch: refetchTopics } = useReadContract({
    address: claimTopicsRegistryAddress as `0x${string}`,
    abi: claimTopicsRegistryAbi,
    functionName: 'getClaimTopics',
    query: {
      enabled: !!claimTopicsRegistryAddress && isValidAddress(claimTopicsRegistryAddress),
    },
  });

  // Update added topics when contract data changes
  useEffect(() => {
    if (existingTopics && Array.isArray(existingTopics)) {
      const topicHashes = existingTopics as string[];
      const addedTopicNames = PREDEFINED_TOPICS
        .filter(topic => topicHashes.includes(topic.hash))
        .map(topic => topic.name);
      setAddedTopics(addedTopicNames);
    }
  }, [existingTopics]);

  // Handle add topic transaction
  const handleAddTopic = async (topic: PredefinedTopic) => {
    if (!userAddress || !isConnected) {
      setError('Please connect your wallet');
      return;
    }

    if (!claimTopicsRegistryAddress) {
      setError('Claim Topics Registry address is required');
      return;
    }

    if (!isValidAddress(claimTopicsRegistryAddress)) {
      setError('Please enter a valid Claim Topics Registry address');
      return;
    }

    if (addedTopics.includes(topic.name)) {
      setError(`Topic "${topic.name}" is already added`);
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);
      setPendingTopic(topic.name);

      console.log('Adding claim topic:', topic.name, 'Hash:', topic.hash);

      await writeContract({
        address: claimTopicsRegistryAddress as `0x${string}`,
        abi: claimTopicsRegistryAbi,
        functionName: 'addClaimTopic',
        args: [BigInt(topic.hash as `0x${string}`)]
      });

    } catch (error) {
      console.error('Add topic error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error adding topic');
      setPendingTopic(null);
    }
  };

  // Handle transaction success
  useEffect(() => {
    if (isTransactionSuccess && txHash && pendingTopic) {
      setSuccessMessage(`Topic "${pendingTopic}" added successfully!`);
      setPendingTopic(null);
      setError(null);
      
      // Refresh the topics list
      setTimeout(() => {
        refetchTopics();
      }, 1000);
    }
  }, [isTransactionSuccess, txHash, pendingTopic, refetchTopics]);

  // Handle transaction errors
  useEffect(() => {
    if (writeError && pendingTopic) {
      setError(writeError.message);
      setPendingTopic(null);
    }
  }, [writeError, pendingTopic]);

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Claim Topics Management</h3>
        <p className="text-yellow-700">Please connect your wallet to manage claim topics.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
      <div className="flex items-center mb-6">
        <div className="bg-purple-100 rounded-full p-2 mr-3">
          <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Claim Topics Management</h3>
          <p className="text-sm text-gray-600">Define what types of verification your T-REX token requires</p>
        </div>
      </div>

      {/* Registry Address Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Claim Topics Registry Address
        </label>
        <input
          type="text"
          placeholder="0x... (from Claim Topics Registry deployment)"
          value={claimTopicsRegistryAddress}
          onChange={(e) => setClaimTopicsRegistryAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-green-800 font-semibold">Success</p>
              <p className="text-green-700 text-sm mt-1">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Topics List */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800 mb-4">Required Claim Topics</h4>
        
        {PREDEFINED_TOPICS.map((topic) => {
          const isAdded = addedTopics.includes(topic.name);
          const isPending = pendingTopic === topic.name;
          const isDisabled = !claimTopicsRegistryAddress || !isValidAddress(claimTopicsRegistryAddress) || isPending || isTransactionLoading;

          return (
            <div key={topic.name} className={`border rounded-lg p-4 ${isAdded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h5 className="font-medium text-gray-900">{topic.name}</h5>
                    {topic.required && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Required
                      </span>
                    )}
                    {isAdded && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        ✓ Added
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">Hash: {topic.hash.substring(0, 10)}...</p>
                </div>
                
                <div className="ml-4">
                  {isAdded ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-md cursor-not-allowed"
                    >
                      Added ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddTopic(topic)}
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-md font-medium transition ${
                        isDisabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    >
                      {isPending ? 'Adding...' : 'Add Topic'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Added Topics Summary */}
      {addedTopics.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Topics Successfully Added</h5>
          <div className="flex flex-wrap gap-2">
            {addedTopics.map((topicName) => (
              <span key={topicName} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {topicName} ✓
              </span>
            ))}
          </div>
          <p className="text-blue-700 text-sm mt-2">
            These topics are now available for issuer authorization in the next step.
          </p>
        </div>
      )}

      {/* Next Steps Hint */}
      {addedTopics.length >= 2 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-green-800 font-semibold">Ready for Next Step</p>
              <p className="text-green-700 text-sm mt-1">
                You have added the essential claim topics. You can now proceed to authorize trusted issuers for these topics.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
