import React, { useState, useEffect } from 'react';
import { useReadContracts, useAccount } from 'wagmi';
import { 
  tokenAbi, 
  tokenAddress,
  identityRegistryAbi,
  identityRegistryAddress,
  defaultComplianceAbi,
  defaultComplianceAddress
} from '../generated';
import { formatUnits } from 'viem';

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  version: string;
  onchainID: string;
  paused: boolean;
  identityRegistry: string;
  compliance: string;
}

interface TokenOverviewProps {
  tokenAddressOverride?: `0x${string}`;
}

export function TokenOverview({ tokenAddressOverride }: TokenOverviewProps) {
  const { chainId } = useAccount();
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<`0x${string}` | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current chain ID for address lookup
  const currentChainId = chainId || 420420420; // Default to Passet Hub testnet
  
  // Determine which token address to use
  const targetTokenAddress = tokenAddressOverride || 
    selectedTokenAddress || 
    tokenAddress[currentChainId as keyof typeof tokenAddress];

  // Contract read configuration
  const tokenContract = {
    address: targetTokenAddress,
    abi: tokenAbi,
  };

  // Read token data using useReadContracts
  const { data: contractData, isError, isLoading: contractLoading, error: contractError } = useReadContracts({
    contracts: [
      {
        ...tokenContract,
        functionName: 'name',
      },
      {
        ...tokenContract,
        functionName: 'symbol',
      },
      {
        ...tokenContract,
        functionName: 'decimals',
      },
      {
        ...tokenContract,
        functionName: 'totalSupply',
      },
      {
        ...tokenContract,
        functionName: 'version',
      },
      {
        ...tokenContract,
        functionName: 'onchainID',
      },
      {
        ...tokenContract,
        functionName: 'paused',
      },
      {
        ...tokenContract,
        functionName: 'identityRegistry',
      },
      {
        ...tokenContract,
        functionName: 'compliance',
      },
    ],
    query: {
      enabled: !!targetTokenAddress,
    },
  });

  // Process contract data
  useEffect(() => {
    if (contractData && !isError && !contractLoading) {
      try {
        const [
          nameResult,
          symbolResult,
          decimalsResult,
          totalSupplyResult,
          versionResult,
          onchainIDResult,
          pausedResult,
          identityRegistryResult,
          complianceResult,
        ] = contractData;

        // Check if all calls were successful
        const allSuccessful = contractData.every(result => result.status === 'success');
        
        if (allSuccessful) {
          setTokenInfo({
            name: nameResult.result as string,
            symbol: symbolResult.result as string,
            decimals: decimalsResult.result as number,
            totalSupply: totalSupplyResult.result as bigint,
            version: versionResult.result as string,
            onchainID: onchainIDResult.result as string,
            paused: pausedResult.result as boolean,
            identityRegistry: identityRegistryResult.result as string,
            compliance: complianceResult.result as string,
          });
          setError(null);
        } else {
          // Find the first failed call
          const failedCall = contractData.find(result => result.status === 'failure');
          setError(`Failed to load token data: ${failedCall?.error?.message || 'Unknown error'}`);
        }
      } catch (err) {
        setError(`Error processing token data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } else if (isError) {
      setError(`Contract read error: ${contractError?.message || 'Unknown error'}`);
    }
    
    setIsLoading(contractLoading);
  }, [contractData, isError, contractLoading, contractError]);

  // Handle token address input
  const handleTokenAddressChange = (address: string) => {
    try {
      if (address && address.startsWith('0x') && address.length === 42) {
        setSelectedTokenAddress(address as `0x${string}`);
        setError(null);
      } else if (address === '') {
        setSelectedTokenAddress(null);
        setError(null);
      } else {
        setError('Invalid token address format');
      }
    } catch (err) {
      setError('Invalid token address');
    }
  };

  // Format large numbers for display
  const formatSupply = (supply: bigint, decimals: number): string => {
    if (decimals === 0) {
      return supply.toString();
    }
    return formatUnits(supply, decimals);
  };

  // Get contract address for current chain
  const getContractAddress = (addressMap: Record<number, `0x${string}`>) => {
    return addressMap[currentChainId] || null;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Token Overview</h2>
        </div>

        {/* Token Address Input */}
        {!tokenAddressOverride && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Address (optional - defaults to deployed TREX token)
            </label>
            <input
              type="text"
              placeholder="0x... or leave empty for default token"
              onChange={(e) => handleTokenAddressChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <span className="text-blue-700">Loading token information...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <div className="bg-red-100 rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-red-800 font-semibold">Error Loading Token</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Token Information Display */}
        {tokenInfo && !isLoading && !error && (
          <div className="space-y-6">
            {/* Basic Token Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  {tokenInfo.symbol.charAt(0)}
                </span>
                {tokenInfo.name} ({tokenInfo.symbol})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-md p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Supply</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatSupply(tokenInfo.totalSupply, tokenInfo.decimals)} {tokenInfo.symbol}
                  </p>
                </div>
                <div className="bg-white rounded-md p-4">
                  <p className="text-sm text-gray-600 mb-1">Decimals</p>
                  <p className="text-lg font-bold text-gray-900">{tokenInfo.decimals}</p>
                </div>
                <div className="bg-white rounded-md p-4">
                  <p className="text-sm text-gray-600 mb-1">T-REX Version</p>
                  <p className="text-lg font-bold text-gray-900">{tokenInfo.version}</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Token Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${tokenInfo.paused ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={`text-sm ${tokenInfo.paused ? 'text-red-700' : 'text-green-700'}`}>
                      {tokenInfo.paused ? 'Paused' : 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {tokenInfo.paused 
                      ? 'Token transfers are currently paused' 
                      : 'Token transfers are enabled'
                    }
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Contract Address</h4>
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">Token Contract</p>
                  <p className="font-mono text-xs break-all bg-white px-2 py-1 rounded border">
                    {targetTokenAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Infrastructure Contracts */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-4">T-REX Infrastructure</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-md p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">OnChain Identity</p>
                  <p className="font-mono text-xs text-gray-600 break-all">
                    {tokenInfo.onchainID}
                  </p>
                </div>
                <div className="bg-white rounded-md p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Identity Registry</p>
                  <p className="font-mono text-xs text-gray-600 break-all">
                    {tokenInfo.identityRegistry}
                  </p>
                </div>
                <div className="bg-white rounded-md p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Compliance Engine</p>
                  <p className="font-mono text-xs text-gray-600 break-all">
                    {tokenInfo.compliance}
                  </p>
                </div>
              </div>
            </div>

            {/* Network Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Network Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Chain ID</p>
                  <p className="font-bold text-blue-900">{currentChainId}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700 mb-1">Network</p>
                  <p className="font-bold text-blue-900">
                    {currentChainId === 420420420 ? 'Passet Hub Testnet' : `Chain ${currentChainId}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Default Token Notice */}
            {!tokenAddressOverride && !selectedTokenAddress && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-800 font-semibold">Default T-REX Token</p>
                    <p className="text-green-700 text-sm mt-1">
                      You're viewing the default TREX token deployed on this network. 
                      Enter a different token address above to explore other T-REX tokens.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Token Available */}
        {!targetTokenAddress && !isLoading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="bg-yellow-100 rounded-full p-1 mr-3 mt-1">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-yellow-800 font-semibold">No Token Found</p>
                <p className="text-yellow-700 text-sm mt-1">
                  No T-REX token is deployed on this network, or please enter a token address to explore.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
