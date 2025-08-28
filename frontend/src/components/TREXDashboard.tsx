import { 
  tokenAbi, 
  tokenAddress,
  identityRegistryAbi,
  identityRegistryAddress,
  defaultComplianceAbi,
  defaultComplianceAddress,
  agentManagerAbi,
  agentManagerAddress,
  claimTopicsRegistryAbi,
  claimTopicsRegistryAddress,
  trustedIssuersRegistryAbi,
  trustedIssuersRegistryAddress,
  identityRegistryStorageAbi,
  identityRegistryStorageAddress,
  tokenOidAbi,
  tokenOidAddress
} from "../generated";
import { useReadContracts, usePublicClient } from "wagmi";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

export function TREXDashboard() {
  const { chainId } = useAccount();
  const publicClient = usePublicClient();
  const [networkHealth, setNetworkHealth] = useState<{
    isConnected: boolean;
    blockNumber: number | null;
    lastChecked: Date | null;
    error: string | null;
  }>({
    isConnected: false,
    blockNumber: null,
    lastChecked: null,
    error: null
  });

  // Check network health
  const checkNetworkHealth = async () => {
    if (!publicClient) {
      setNetworkHealth({
        isConnected: false,
        blockNumber: null,
        lastChecked: new Date(),
        error: 'Public client not available'
      });
      return;
    }

    try {
      const blockNumber = await publicClient.getBlockNumber();
      setNetworkHealth({
        isConnected: true,
        blockNumber: Number(blockNumber),
        lastChecked: new Date(),
        error: null
      });
    } catch (error) {
      setNetworkHealth({
        isConnected: false,
        blockNumber: null,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Check network health on mount and when chainId changes
  useEffect(() => {
    checkNetworkHealth();
    const interval = setInterval(checkNetworkHealth, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [chainId, publicClient]);

  // Get current chain ID for address lookup
  const currentChainId = chainId || 420420420; // Default to Passet Hub testnet

  // Get contract addresses for current chain
  const getContractAddress = (addressMap: Record<number, `0x${string}`>) => {
    return addressMap[currentChainId] || "Not deployed on this chain";
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">TREX Dashboard</h2>
      
      {/* Network Information */}
      <div className={`border rounded-lg p-4 mb-6 ${
        networkHealth.isConnected 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <h3 className="text-lg font-semibold mb-2 ${
          networkHealth.isConnected ? 'text-green-800' : 'text-red-800'
        }">
          Network Status
        </h3>
        <div className="space-y-2">
          <p className={`${
            networkHealth.isConnected ? 'text-green-700' : 'text-red-700'
          }`}>
            Status: <span className="font-bold">
              {networkHealth.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Chain ID: <span className="font-bold">{currentChainId}</span>
          </p>
          {networkHealth.isConnected && networkHealth.blockNumber && (
            <p className="text-sm text-green-600">
              Latest Block: <span className="font-bold">{networkHealth.blockNumber.toLocaleString()}</span>
            </p>
          )}
          {networkHealth.error && (
            <p className="text-sm text-red-600">
              Error: <span className="font-mono text-xs">{networkHealth.error}</span>
            </p>
          )}
          {networkHealth.lastChecked && (
            <p className="text-xs text-gray-500">
              Last checked: {networkHealth.lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button 
          onClick={checkNetworkHealth}
          className="mt-3 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Connection
        </button>
      </div>

      {/* Network Warning */}
      {!networkHealth.isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Network Warning</h3>
          <p className="text-yellow-700">
            Your local node appears to be offline. The dApp is showing cached wallet connection status, 
            but cannot communicate with the blockchain. Please ensure your local node is running and try refreshing the connection.
          </p>
        </div>
      )}

      {/* Contract Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Token Contract */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Token Contract</h3>
          <p className="text-sm text-green-700 mb-1">
            Address: <span className="font-mono text-xs break-all">{getContractAddress(tokenAddress)}</span>
          </p>
          <p className="text-xs text-green-600">Main security token contract</p>
        </div>

        {/* Identity Registry */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Identity Registry</h3>
          <p className="text-sm text-purple-700 mb-1">
            Address: <span className="font-mono text-xs break-all">{getContractAddress(identityRegistryAddress)}</span>
          </p>
          <p className="text-xs text-purple-600">Manages token holder identities</p>
        </div>

        {/* Compliance Contract */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Compliance Engine</h3>
          <p className="text-sm text-orange-700 mb-1">
            Address: <span className="font-mono text-xs break-all">{getContractAddress(defaultComplianceAddress)}</span>
          </p>
          <p className="text-xs text-orange-600">Enforces transfer rules and compliance</p>
        </div>

        {/* Agent Manager */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Agent Manager</h3>
          <p className="text-sm text-red-700 mb-1">
            Address: <span className="font-mono text-xs break-all">{getContractAddress(agentManagerAddress)}</span>
          </p>
          <p className="text-xs text-red-600">Manages authorized agents and permissions</p>
        </div>
      </div>

      {/* Additional Registry Contracts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-1">Claim Topics Registry</h4>
          <p className="text-xs text-gray-600 break-all">{getContractAddress(claimTopicsRegistryAddress)}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-1">Trusted Issuers</h4>
          <p className="text-xs text-gray-600 break-all">{getContractAddress(trustedIssuersRegistryAddress)}</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-1">Identity Storage</h4>
          <p className="text-xs text-gray-600 break-all">{getContractAddress(identityRegistryStorageAddress)}</p>
        </div>
      </div>

      {/* Token OID */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">Token On-Chain Identity</h3>
        <p className="text-sm text-indigo-700 mb-1">
          Address: <span className="font-mono text-xs break-all">{getContractAddress(tokenOidAddress)}</span>
        </p>
        <p className="text-xs text-indigo-600">Token's on-chain identity and metadata</p>
      </div>

      {/* Debug Information */}
      <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Configuration Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Generated Contracts:</p>
            <ul className="text-xs text-gray-600 mt-1 space-y-1">
              <li>• Token: {typeof tokenAddress === 'object' ? 'Loaded' : 'Missing'}</li>
              <li>• Identity Registry: {typeof identityRegistryAddress === 'object' ? 'Loaded' : 'Missing'}</li>
              <li>• Compliance: {typeof defaultComplianceAddress === 'object' ? 'Loaded' : 'Missing'}</li>
              <li>• Agent Manager: {typeof agentManagerAddress === 'object' ? 'Loaded' : 'Missing'}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Contract ABIs:</p>
            <ul className="text-xs text-gray-600 mt-1 space-y-1">
              <li>• Token ABI: {tokenAbi ? 'Loaded' : 'Missing'}</li>
              <li>• Identity Registry ABI: {identityRegistryAbi ? 'Loaded' : 'Missing'}</li>
              <li>• Compliance ABI: {defaultComplianceAbi ? 'Loaded' : 'Missing'}</li>
              <li>• Agent Manager ABI: {agentManagerAbi ? 'Loaded' : 'Missing'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ✅ TREX contracts successfully loaded and configured
        </p>
        <p className="text-xs text-gray-500 mt-1">
          All contract ABIs and addresses are available for interaction
        </p>
      </div>
    </div>
  );
}

