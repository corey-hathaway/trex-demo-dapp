import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { trustedIssuersRegistryAbi, claimTopicsRegistryAbi } from '../generated';
import { keccak256, toBytes } from 'viem';

interface RegisteredTopic {
  hash: string;
  name: string;
  description: string;
}

interface TopicOption extends RegisteredTopic {
  selected: boolean;
  alreadyAuthorized: boolean;
}

// Map common hashes back to readable names
const getTopicNameFromHash = (hash: string | unknown): string => {
  // Ensure hash is a string
  const hashString = typeof hash === 'string' ? hash : String(hash);
  
  const knownTopics: Record<string, string> = {
    [keccak256(toBytes("KYC_VERIFIED"))]: "KYC_VERIFIED",
    [keccak256(toBytes("AML_CLEARED"))]: "AML_CLEARED", 
    [keccak256(toBytes("COUNTRY_VERIFIED"))]: "COUNTRY_VERIFIED",
    [keccak256(toBytes("CLAIM_TOPIC"))]: "CLAIM_TOPIC"
  };
  
  return knownTopics[hashString] || `TOPIC_${hashString.substring(2, 10).toUpperCase()}`;
};

const getTopicDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    "KYC_VERIFIED": "Know Your Customer verification completed",
    "AML_CLEARED": "Anti-Money Laundering screening passed", 
    "COUNTRY_VERIFIED": "Investor country/jurisdiction verified",
    "CLAIM_TOPIC": "Generic claim verification"
  };
  
  return descriptions[name] || "Custom claim verification";
};

export function IssuerTopicAuthorization() {
  const { address: userAddress, isConnected } = useAccount();
  const { writeContract, data: txHash, error: writeError, isPending: isWritePending } = useWriteContract();
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [trustedIssuersRegistryAddress, setTrustedIssuersRegistryAddress] = useState('');
  const [claimTopicsRegistryAddress, setClaimTopicsRegistryAddress] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('');
  const [topicOptions, setTopicOptions] = useState<TopicOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [lastAuthorizedCount, setLastAuthorizedCount] = useState(0);

  // Validate address format
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Get trusted issuers from registry
  const { data: trustedIssuers, refetch: refetchIssuers } = useReadContract({
    address: trustedIssuersRegistryAddress as `0x${string}`,
    abi: trustedIssuersRegistryAbi,
    functionName: 'getTrustedIssuers',
    query: {
      enabled: !!trustedIssuersRegistryAddress && isValidAddress(trustedIssuersRegistryAddress),
    },
  });

  // Get claim topics from registry
  const { data: claimTopics, refetch: refetchTopics } = useReadContract({
    address: claimTopicsRegistryAddress as `0x${string}`,
    abi: claimTopicsRegistryAbi,
    functionName: 'getClaimTopics',
    query: {
      enabled: !!claimTopicsRegistryAddress && isValidAddress(claimTopicsRegistryAddress),
    },
  });

  // Get current authorizations for selected issuer
  const { data: issuerTopics, refetch: refetchIssuerTopics } = useReadContract({
    address: trustedIssuersRegistryAddress as `0x${string}`,
    abi: trustedIssuersRegistryAbi,
    functionName: 'getTrustedIssuerClaimTopics',
    args: [selectedIssuer as `0x${string}`],
    query: {
      enabled: !!trustedIssuersRegistryAddress && !!selectedIssuer && isValidAddress(selectedIssuer),
    },
  });

  // Process available topics when data changes
  useEffect(() => {
    if (claimTopics && Array.isArray(claimTopics)) {
      try {
        const topicHashes = (claimTopics as readonly bigint[]).map(hash => String(hash));
        const currentIssuerTopics = (issuerTopics as readonly bigint[])?.map(hash => String(hash)) || [];
        
        const options: TopicOption[] = topicHashes.map(hash => {
          const hashString = String(hash); // Ensure it's a string
          const name = getTopicNameFromHash(hashString);
          return {
            hash: hashString,
            name,
            description: getTopicDescription(name),
            selected: false,
            alreadyAuthorized: currentIssuerTopics.includes(hashString)
          };
        });
        
        setTopicOptions(options);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error processing claim topics:', error);
        setError('Error processing claim topics data');
      }
    }
  }, [claimTopics, issuerTopics]);

  // Handle topic selection toggle
  const toggleTopicSelection = (topicHash: string) => {
    setTopicOptions(prev => 
      prev.map(topic => 
        topic.hash === topicHash 
          ? { ...topic, selected: !topic.selected }
          : topic
      )
    );
  };

  // Select all available topics
  const selectAllTopics = () => {
    setTopicOptions(prev => 
      prev.map(topic => ({ 
        ...topic, 
        selected: !topic.alreadyAuthorized 
      }))
    );
  };

  // Clear all selections
  const clearSelection = () => {
    setTopicOptions(prev => 
      prev.map(topic => ({ ...topic, selected: false }))
    );
  };

  // Reset error state and try again
  const resetErrorState = () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoadingData(false);
  };

  // Handle authorization
  const handleAuthorizeIssuer = async () => {
    if (!userAddress || !isConnected) {
      setError('Please connect your wallet');
      return;
    }

    if (!selectedIssuer) {
      setError('Please select a trusted issuer');
      return;
    }

    if (!trustedIssuersRegistryAddress || !isValidAddress(trustedIssuersRegistryAddress)) {
      setError('Please enter a valid Trusted Issuers Registry address');
      return;
    }

    const selectedTopics = topicOptions.filter(topic => topic.selected);
    
    if (selectedTopics.length === 0) {
      setError('Please select at least one claim topic to authorize');
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);
      setIsLoadingData(true);

      // Store the count of topics being authorized for success message
      setLastAuthorizedCount(selectedTopics.length);

      // Get current issuer topics and merge with selected ones
      const currentTopics = (issuerTopics as readonly bigint[])?.map(hash => String(hash)) || [];
      const newTopics = selectedTopics.map(topic => topic.hash);
      
      // Merge current and new topics (remove duplicates)
      const allTopics = [...new Set([...currentTopics, ...newTopics])];

      console.log('Authorizing issuer:', selectedIssuer);
      console.log('For topics:', allTopics);

      // Choose the right function based on whether issuer already exists
      const functionName = currentTopics.length > 0 ? 'updateIssuerClaimTopics' : 'addTrustedIssuer';
      
      console.log(`Using function: ${functionName}`);
      console.log('Current topics:', currentTopics);
      console.log('All topics after merge:', allTopics);

      // Convert topics back to bigint for contract call
      const topicsAsBigInt = allTopics.map(topic => BigInt(topic));

      await writeContract({
        address: trustedIssuersRegistryAddress as `0x${string}`,
        abi: trustedIssuersRegistryAbi,
        functionName: functionName,
        args: [selectedIssuer as `0x${string}`, topicsAsBigInt]
      });

    } catch (error) {
      console.error('Authorization error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error during authorization');
      setIsLoadingData(false);
    }
  };

  // Handle transaction success
  useEffect(() => {
    if (isTransactionSuccess && txHash) {
      // Use the stored count from when transaction was initiated
      setSuccessMessage(`Issuer authorized for ${lastAuthorizedCount} claim topic(s) successfully!`);
      setIsLoadingData(false);
      setError(null);
      
      // Clear selections and refresh data
      clearSelection();
      setTimeout(() => {
        refetchIssuerTopics();
        refetchIssuers();
      }, 1000);
    }
  }, [isTransactionSuccess, txHash, lastAuthorizedCount, refetchIssuerTopics, refetchIssuers]);

  // Handle transaction completion (success or failure)
  useEffect(() => {
    // Reset loading state when transaction is no longer pending
    if (!isWritePending && !isTransactionLoading) {
      setIsLoadingData(false);
    }
  }, [isWritePending, isTransactionLoading]);

  // Handle write errors (immediate contract call failures)
  useEffect(() => {
    if (writeError) {
      console.error('Transaction write error:', writeError);
      setError(`Transaction failed: ${(writeError as any).shortMessage || writeError.message}`);
      setIsLoadingData(false);
    }
  }, [writeError]);

  // Handle transaction hash but check for eventual failure
  useEffect(() => {
    if (txHash && !isTransactionLoading && !isTransactionSuccess) {
      // Transaction was submitted but might have failed
      // This catches cases where the transaction was mined but reverted
      console.warn('Transaction submitted but may have failed:', txHash);
      
      // Only show error if we're not in a loading state and transaction didn't succeed
      if (!isWritePending) {
        setError('Transaction was submitted but may have failed. Please check the transaction status and try again.');
        setIsLoadingData(false);
      }
    }
  }, [txHash, isTransactionLoading, isTransactionSuccess, isWritePending]);

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Issuer Topic Authorization</h3>
        <p className="text-yellow-700">Please connect your wallet to authorize issuers for claim topics.</p>
      </div>
    );
  }

  const selectedTopicsCount = topicOptions.filter(topic => topic.selected).length;
  const authorizedTopicsCount = topicOptions.filter(topic => topic.alreadyAuthorized).length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
      <div className="flex items-center mb-6">
        <div className="bg-indigo-100 rounded-full p-2 mr-3">
          <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Issuer Topic Authorization</h3>
          <p className="text-sm text-gray-600">Authorize trusted issuers for specific claim topics</p>
        </div>
      </div>

      {/* Registry Address Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trusted Issuers Registry Address
          </label>
          <input
            type="text"
            placeholder="0x... (from Claim Issuer Management)"
            value={trustedIssuersRegistryAddress}
            onChange={(e) => setTrustedIssuersRegistryAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Claim Topics Registry Address
          </label>
          <input
            type="text"
            placeholder="0x... (from previous step)"
            value={claimTopicsRegistryAddress}
            onChange={(e) => setClaimTopicsRegistryAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-red-800 font-semibold">Transaction Failed</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                {txHash && (
                  <p className="text-red-600 text-xs mt-2 font-mono">
                    Transaction Hash: {txHash}
                  </p>
                )}
                <div className="mt-3 text-red-700 text-sm">
                  <p className="font-medium">Common causes:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Insufficient permissions (not owner/agent of registry)</li>
                    <li>Invalid issuer address or claim topics</li>
                    <li>Network congestion or insufficient gas</li>
                    <li>Issuer already has maximum authorizations</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <button
                onClick={resetErrorState}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition"
              >
                Try Again
              </button>
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

      {/* Issuer Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Trusted Issuer
        </label>
        {trustedIssuers && Array.isArray(trustedIssuers) && trustedIssuers.length > 0 ? (
          <select
            value={selectedIssuer}
            onChange={(e) => setSelectedIssuer(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Choose an issuer to authorize...</option>
            {(trustedIssuers as string[]).map((issuer) => (
              <option key={issuer} value={issuer}>
                {String(issuer).substring(0, 6)}...{String(issuer).substring(38)} 
              </option>
            ))}
          </select>
        ) : (
          <div className="text-sm text-gray-500 italic">
            {trustedIssuersRegistryAddress && isValidAddress(trustedIssuersRegistryAddress) 
              ? "No trusted issuers found. Add issuers first."
              : "Enter Trusted Issuers Registry address to load issuers"
            }
          </div>
        )}
      </div>

      {/* Topic Selection */}
      {selectedIssuer && topicOptions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-800">Authorize for Claim Topics</h4>
            <div className="flex gap-2">
              <button
                onClick={selectAllTopics}
                className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {topicOptions.map((topic) => (
              <div key={topic.hash} className={`border rounded-lg p-4 ${
                topic.alreadyAuthorized ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={topic.selected}
                        onChange={() => toggleTopicSelection(topic.hash)}
                        disabled={topic.alreadyAuthorized}
                        className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">{topic.name}</h5>
                        <p className="text-sm text-gray-600">{topic.description}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          {String(topic.hash).substring(0, 10)}...
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {topic.alreadyAuthorized && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        ✓ Authorized
                      </span>
                    )}
                    {topic.selected && !topic.alreadyAuthorized && (
                      <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Authorization Action */}
          {selectedTopicsCount > 0 && (
            <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-indigo-900">Ready to Authorize</h5>
                  <p className="text-sm text-indigo-700 mt-1">
                    Will {authorizedTopicsCount > 0 ? 'update' : 'add'} issuer authorization for {selectedTopicsCount} new topic(s)
                    {authorizedTopicsCount > 0 && ` (${authorizedTopicsCount} already authorized)`}
                  </p>
                  <p className="text-xs text-indigo-600 mt-1">
                    Using: {authorizedTopicsCount > 0 ? 'updateIssuerClaimTopics' : 'addTrustedIssuer'}
                  </p>
                  {(isLoadingData || isTransactionLoading) && (
                    <p className="text-xs text-indigo-600 mt-2">
                      {isWritePending && 'Submitting transaction...'}
                      {isTransactionLoading && 'Waiting for confirmation...'}
                      {isLoadingData && !isWritePending && !isTransactionLoading && 'Processing...'}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleAuthorizeIssuer}
                  disabled={isLoadingData || isTransactionLoading}
                  className={`px-6 py-2 rounded-md font-medium transition ${
                    isLoadingData || isTransactionLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  {isWritePending ? 'Submitting...' : 
                   isTransactionLoading ? 'Confirming...' : 
                   isLoadingData ? 'Processing...' : 
                   'Authorize Issuer'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Status Summary */}
      {selectedIssuer && authorizedTopicsCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Current Authorizations</h5>
          <p className="text-blue-700 text-sm">
            This issuer is currently authorized for {authorizedTopicsCount} claim topic(s).
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {topicOptions
              .filter(topic => topic.alreadyAuthorized)
              .map(topic => (
                <span key={topic.hash} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {topic.name} ✓
                </span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
