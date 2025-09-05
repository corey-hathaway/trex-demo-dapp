import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { tokenAbi } from '../generated';

interface MintingForm {
  tokenAddress: string;
  recipientAddress: string;
  amount: string;
}

export function TokenMinting() {
  const { address: userAddress } = useAccount();
  const { writeContract, data: txHash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [formData, setFormData] = useState<MintingForm>({
    tokenAddress: '',
    recipientAddress: '',
    amount: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Validation helper
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Handle form input changes
  const handleInputChange = (field: keyof MintingForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Handle minting
  const handleMint = async () => {
    // Basic validation
    if (!userAddress) {
      setError('Please connect your wallet');
      return;
    }

    if (!formData.tokenAddress.trim()) {
      setError('Token address is required');
      return;
    }

    if (!isValidAddress(formData.tokenAddress)) {
      setError('Invalid token address format');
      return;
    }

    if (!formData.recipientAddress.trim()) {
      setError('Recipient address is required');
      return;
    }

    if (!isValidAddress(formData.recipientAddress)) {
      setError('Invalid recipient address format');
      return;
    }

    if (!formData.amount.trim()) {
      setError('Amount is required');
      return;
    }

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    try {
      setError(null);

      // Convert amount to proper decimals (TREX token has 0 decimals)
      const amountInWei = BigInt(Math.floor(amountNum));

      console.log('Minting tokens:', {
        tokenAddress: formData.tokenAddress,
        recipient: formData.recipientAddress,
        amount: formData.amount,
        amountInWei: amountInWei.toString()
      });

      await writeContract({
        address: formData.tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: 'mint',
        args: [
          formData.recipientAddress as `0x${string}`,
          amountInWei
        ]
      });

    } catch (error) {
      console.error('Minting error:', error);
      setError(error instanceof Error ? error.message : 'Unknown minting error');
    }
  };

  // Handle success state
  React.useEffect(() => {
    if (isSuccess) {
      console.log('Tokens minted successfully!');
      // Optionally reset form
      setFormData({
        tokenAddress: formData.tokenAddress, // Keep token address for convenience
        recipientAddress: '',
        amount: ''
      });
    }
  }, [isSuccess]);

  // Handle write error
  React.useEffect(() => {
    if (writeError) {
      setError(writeError.message);
    }
  }, [writeError]);

  const resetForm = () => {
    setFormData({
      tokenAddress: '',
      recipientAddress: '',
      amount: ''
    });
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Component Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Token Minting</h2>
            <p className="text-green-100">Mint new tokens (Agent Only)</p>
          </div>
          <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
            🪙
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-b-lg p-6">
        {/* Token Address Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Contract Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={formData.tokenAddress}
            onChange={(e) => handleInputChange('tokenAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Address of the T-REX token contract to mint from
          </p>
        </div>

        {/* Recipient Address Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={formData.recipientAddress}
            onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Address that will receive the newly minted tokens
          </p>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            step="1"
            min="0"
            placeholder="1.0"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of tokens to mint (TREX token has 0 decimals - whole numbers only)
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {isSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm">
              ✅ Tokens minted successfully! Transaction hash: {txHash}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleMint}
            disabled={isPending || isConfirming || !userAddress}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {isPending ? (
              'Preparing...'
            ) : isConfirming ? (
              'Confirming...'
            ) : (
              'Mint Tokens'
            )}
          </button>

          <button
            onClick={resetForm}
            disabled={isPending || isConfirming}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg transition"
          >
            Reset
          </button>
        </div>

        {/* Helper Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Test Values:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Token:</strong> 0xEC69d4f48f4f1740976968FAb9828d645Ad1d77f</p>
            <p><strong>Alice:</strong> 0x3452D27d07C7004007ac986cD3Efa3Ac36677680</p>
            <p><strong>Bob:</strong> 0x234Ab1c08319e690b5B41652bf028C6Af85063c8</p>
            <p><strong>Charlie:</strong> 0x1da264b338befffD424eF64734D5f7689274E82B</p>
            <p><strong>Amount:</strong> Try small whole numbers like 1, 5, 10 (0 decimals)</p>
          </div>
        </div>

        {/* Troubleshooting Info */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">⚠️ Common Issues:</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <p><strong>1. Agent Permission:</strong> Your wallet must be added as an agent to the token contract</p>
            <p><strong>2. Identity Verification:</strong> Recipient must be verified in the Identity Registry</p>
            <p><strong>3. Compliance Rules:</strong> Transfer must pass all compliance checks</p>
            <p><strong>4. Token Decimals:</strong> TREX token uses 0 decimals (whole numbers only)</p>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          {!userAddress ? (
            '⚠️ Connect your wallet to mint tokens'
          ) : (
            `Connected: ${userAddress.substring(0, 6)}...${userAddress.substring(38)}`
          )}
        </div>
      </div>
    </div>
  );
}
