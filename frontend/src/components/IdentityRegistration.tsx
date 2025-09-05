import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { identityRegistryAbi } from '../generated';

interface Props {
  tokenAddress?: string;
}

export function IdentityRegistration({ tokenAddress }: Props) {
  const { address: userAddress, isConnected } = useAccount();
  const [identityRegistryAddress, setIdentityRegistryAddress] = useState('');
  const [identityAddress, setIdentityAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [country, setCountry] = useState(42); // Default country code
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Validate address format
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Check if identity is already registered
  const { data: isRegistered } = useReadContract({
    address: identityRegistryAddress as `0x${string}`,
    abi: identityRegistryAbi,
    functionName: 'contains',
    args: [walletAddress as `0x${string}`],
    query: {
      enabled: !!identityRegistryAddress && !!walletAddress && isValidAddress(walletAddress) && isValidAddress(identityRegistryAddress),
    },
  });

  // Get identity from wallet address
  const { data: registeredIdentity } = useReadContract({
    address: identityRegistryAddress as `0x${string}`,
    abi: identityRegistryAbi,
    functionName: 'identity',
    args: [walletAddress as `0x${string}`],
    query: {
      enabled: !!identityRegistryAddress && !!walletAddress && isValidAddress(walletAddress) && isValidAddress(identityRegistryAddress),
    },
  });

  const handleRegisterIdentity = async () => {
    try {
      if (!identityAddress) {
        setError('Please enter an identity address');
        return;
      }

      if (!walletAddress) {
        setError('Please enter a wallet address');
        return;
      }

      if (!identityRegistryAddress) {
        setError('Identity Registry address is required');
        return;
      }

      if (!isValidAddress(identityAddress)) {
        setError('Please enter a valid identity address');
        return;
      }

      if (!isValidAddress(walletAddress)) {
        setError('Please enter a valid wallet address');
        return;
      }

      if (!isValidAddress(identityRegistryAddress)) {
        setError('Please enter a valid Identity Registry address');
        return;
      }

      if (isRegistered) {
        setError('This wallet address is already registered with this token');
        return;
      }

      setError(null);
      setIsLoading(true);

      console.log('Registering identity:', {
        walletAddress,
        identityAddress,
        country,
        identityRegistryAddress
      });

      await writeContract({
        address: identityRegistryAddress as `0x${string}`,
        abi: identityRegistryAbi,
        functionName: 'registerIdentity',
        args: [
          walletAddress as `0x${string}`,
          identityAddress as `0x${string}`,
          country
        ]
      });

    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error during registration');
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isTransactionSuccess) {
      setIsLoading(false);
      setError(null);
      console.log('Identity registration successful!');
    }
  }, [isTransactionSuccess]);

  React.useEffect(() => {
    if (hash && !isTransactionLoading && !isTransactionSuccess) {
      setIsLoading(false);
    }
  }, [hash, isTransactionLoading, isTransactionSuccess]);

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Identity Registration</h3>
        <p className="text-yellow-700">Please connect your wallet to register identities.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Identity Registration</h3>
      
      <div className="space-y-4">
        {/* Token Address Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token Address
          </label>
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
            {tokenAddress || 'No token address provided'}
          </div>
        </div>

        {/* Identity Registry Address Input */}
        <div>
          <label htmlFor="identityRegistryAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Identity Registry Address *
          </label>
          <input
            type="text"
            id="identityRegistryAddress"
            value={identityRegistryAddress}
            onChange={(e) => setIdentityRegistryAddress(e.target.value)}
            placeholder="0x... (Token's Identity Registry address)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get this address from Token Overview → Identity Registry. Each token has its own Identity Registry.
          </p>
        </div>

        {/* Identity Address Input */}
        <div>
          <label htmlFor="identityAddress" className="block text-sm font-medium text-gray-700 mb-1">
            OnChain ID Address *
          </label>
          <input
            type="text"
            id="identityAddress"
            value={identityAddress}
            onChange={(e) => setIdentityAddress(e.target.value)}
            placeholder="0x... (OnChain ID contract address)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            The deployed OnChain ID contract address for this user
          </p>
        </div>

        {/* Wallet Address Input */}
        <div>
          <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Wallet Address *
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x... (User's wallet address)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            The wallet address that will be linked to the OnChain ID
          </p>
        </div>

        {/* Country Code Input */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country Code
          </label>
          <input
            type="number"
            id="country"
            value={country}
            onChange={(e) => setCountry(parseInt(e.target.value) || 42)}
            placeholder="42"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Numeric country code (e.g., 42 for testing, 840 for USA)
          </p>
        </div>

        {/* Registration Status */}
        {walletAddress && isValidAddress(walletAddress) && identityRegistryAddress && isValidAddress(identityRegistryAddress) && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Registration Status</h4>
            {isRegistered ? (
              <div className="text-green-600 text-sm">
                ✅ This wallet is already registered with this Identity Registry
                {registeredIdentity && registeredIdentity !== '0x0000000000000000000000000000000000000000' && (
                  <div className="mt-1 text-xs text-gray-600">
                    Identity: {registeredIdentity as string}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-orange-600 text-sm">
                ⏳ This wallet is not yet registered with this Identity Registry
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {isTransactionSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-600 text-sm">
              ✅ Identity registration successful! The wallet can now receive and transfer tokens.
            </p>
          </div>
        )}

        {/* Register Button */}
        <button
          onClick={handleRegisterIdentity}
          disabled={
            isLoading || 
            isTransactionLoading || 
            !identityRegistryAddress || 
            !identityAddress || 
            !walletAddress ||
            isRegistered ||
            !isValidAddress(identityAddress) ||
            !isValidAddress(walletAddress) ||
            !isValidAddress(identityRegistryAddress)
          }
          className={`w-full py-2 px-4 rounded-md font-medium ${
            isLoading || isTransactionLoading || !identityRegistryAddress || !identityAddress || !walletAddress || isRegistered
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading || isTransactionLoading ? (
            'Registering Identity...'
          ) : isRegistered ? (
            'Already Registered'
          ) : (
            'Register Identity'
          )}
        </button>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">How to Register</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Copy Identity Registry address from Token Overview</li>
            <li>2. Enter the OnChain ID contract address</li>
            <li>3. Enter the wallet address to link</li>
            <li>4. Set the country code (optional)</li>
            <li>5. Click "Register Identity"</li>
          </ol>
          <p className="text-xs text-blue-600 mt-2">
            Note: Only Identity Registry agents can register identities. Make sure you're connected as an agent.
          </p>
        </div>
      </div>
    </div>
  );
}
