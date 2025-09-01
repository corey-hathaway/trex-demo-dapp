import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { keccak256, stringToBytes, zeroAddress, decodeEventLog } from 'viem';
import { 
  trexFactoryAbi, 
  trexFactoryAddress,
  claimIssuerContractAddress 
} from '../generated';



interface TokenDetails {
  owner: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number; // Will be converted to uint8
  irs: `0x${string}`;
  ONCHAINID: `0x${string}`;
  irAgents: readonly `0x${string}`[];
  tokenAgents: readonly `0x${string}`[];
  complianceModules: readonly `0x${string}`[];
  complianceSettings: readonly `0x${string}`[];
}

interface ClaimDetails {
  claimTopics: readonly bigint[]; // Will be converted to uint256[]
  issuers: readonly `0x${string}`[];
  issuerClaims: readonly (readonly bigint[])[]; // Will be converted to uint256[][]
}

// Contract parameter conversion utilities

interface FormData {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
}

type DeploymentStep = 'form' | 'review' | 'deploying' | 'success' | 'error';

export function DeployToken() {
  const { address: userAddress, chainId } = useAccount();
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [step, setStep] = useState<DeploymentStep>('form');
  const [formData, setFormData] = useState<FormData>({
    tokenName: '',
    tokenSymbol: '',
    tokenDecimals: 0
  });
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [salt, setSalt] = useState<string>('');
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [claimDetails, setClaimDetails] = useState<ClaimDetails | null>(null);

  // Generate unique salt
  const generateSalt = (symbol: string) => {
    return `${symbol}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  };

  // Create default claim configuration
  const createDefaultClaimDetails = (): ClaimDetails => {
    const kycTopic = BigInt(keccak256(stringToBytes('KYC_VERIFIED')));
    const currentChainId = chainId || 420420420;
    const claimIssuerAddress = claimIssuerContractAddress[currentChainId as keyof typeof claimIssuerContractAddress];
    
    return {
      claimTopics: [kycTopic],
      issuers: [claimIssuerAddress || userAddress || '0x0000000000000000000000000000000000000000'] as readonly `0x${string}`[],
      issuerClaims: [[kycTopic]]
    };
  };

  // Create token details
  const createTokenDetails = (): TokenDetails => {
    return {
      owner: (userAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`,
      name: formData.tokenName,
      symbol: formData.tokenSymbol,
      decimals: Math.max(0, Math.min(18, Math.floor(formData.tokenDecimals))), // Ensure uint8 range (0-255)
      irs: "0x598efcBD0B5b4Fd0142bEAae1a38f6Bd4d8a218d", // Reuse existing IRS from deployment
      ONCHAINID: zeroAddress,
      irAgents: [],
      tokenAgents: [],
      complianceModules: [],
      complianceSettings: []
    };
  };

  // Convert to contract-compatible format
  const convertToContractParams = (salt: string, tokenDetails: TokenDetails, claimDetails: ClaimDetails): [string, any, any] => {
    // Convert TokenDetails - ensure decimals is within uint8 range
    const contractTokenDetails = {
      owner: tokenDetails.owner,
      name: tokenDetails.name,
      symbol: tokenDetails.symbol,
      decimals: tokenDetails.decimals, // Already validated as uint8 range
      irs: tokenDetails.irs,
      ONCHAINID: tokenDetails.ONCHAINID,
      irAgents: tokenDetails.irAgents,
      tokenAgents: tokenDetails.tokenAgents,
      complianceModules: tokenDetails.complianceModules,
      complianceSettings: tokenDetails.complianceSettings
    };

    // Convert ClaimDetails - convert BigInt to Number for uint256 compatibility
    const contractClaimDetails = {
      claimTopics: claimDetails.claimTopics.map(topic => topic.toString()),
      issuers: claimDetails.issuers,
      issuerClaims: claimDetails.issuerClaims.map(claims => 
        claims.map(claim => claim.toString())
      )
    };

    return [salt, contractTokenDetails, contractClaimDetails];
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!formData.tokenName.trim()) return 'Token name is required';
    if (!formData.tokenSymbol.trim()) return 'Token symbol is required';
    if (formData.tokenSymbol.length < 2 || formData.tokenSymbol.length > 6) {
      return 'Token symbol must be 2-6 characters';
    }
    if (formData.tokenDecimals < 0 || formData.tokenDecimals > 18) {
      return 'Token decimals must be between 0 and 18';
    }
    if (!userAddress) return 'Please connect your wallet';
    return null;
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setDeploymentError(validationError);
      return;
    }

    // Generate salt and prepare deployment data
    const newSalt = generateSalt(formData.tokenSymbol);
    const newTokenDetails = createTokenDetails();
    const newClaimDetails = createDefaultClaimDetails();
    
    setSalt(newSalt);
    setTokenDetails(newTokenDetails);
    setClaimDetails(newClaimDetails);
    setDeploymentError(null);
    setStep('review');
  };

  // Handle deployment confirmation
  const handleDeployment = async () => {
    if (!tokenDetails || !claimDetails || !userAddress || !chainId) {
      setDeploymentError('Missing deployment data');
      return;
    }

    const currentChainId = chainId;
    const factoryAddress = trexFactoryAddress[currentChainId as keyof typeof trexFactoryAddress];
    
    if (!factoryAddress) {
      setDeploymentError(`TREXFactory not deployed on chain ${currentChainId}`);
      return;
    }

    try {
      setStep('deploying');
      setDeploymentError(null);

      // Convert parameters to contract-compatible types
      const contractArgs = convertToContractParams(salt, tokenDetails, claimDetails);

      await writeContract({
        address: factoryAddress,
        abi: trexFactoryAbi,
        functionName: 'deployTREXSuite',
        args: contractArgs,
        gas: 30000000n
      });
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentError(error instanceof Error ? error.message : 'Unknown deployment error');
      setStep('error');
    }
  };

  // Handle success/error state changes
  React.useEffect(() => {
    if (isSuccess && step === 'deploying') {
      setStep('success');
    }
    if (writeError && step === 'deploying') {
      setDeploymentError(writeError.message);
      setStep('error');
    }
  }, [isSuccess, writeError, step]);

  // Reset form
  const resetForm = () => {
    setFormData({ tokenName: '', tokenSymbol: '', tokenDecimals: 0 });
    setStep('form');
    setDeploymentError(null);
    setSalt('');
    setTokenDetails(null);
    setClaimDetails(null);
  };

  if (!userAddress) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Wallet Required</h3>
          <p className="text-yellow-700">
            Please connect your wallet to deploy a new T-REX security token.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Deploy New T-REX Token</h2>

      {/* Step 1: Form */}
      {step === 'form' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Token Configuration</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="tokenName" className="block text-sm font-medium text-gray-700 mb-1">
                Token Name
              </label>
              <input
                id="tokenName"
                type="text"
                value={formData.tokenName}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenName: e.target.value }))}
                placeholder="My Security Token"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-700 mb-1">
                Token Symbol
              </label>
              <input
                id="tokenSymbol"
                type="text"
                value={formData.tokenSymbol}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenSymbol: e.target.value.toUpperCase() }))}
                placeholder="MST"
                maxLength={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">2-6 characters, will be converted to uppercase</p>
            </div>

            <div>
              <label htmlFor="tokenDecimals" className="block text-sm font-medium text-gray-700 mb-1">
                Token Decimals
              </label>
              <input
                id="tokenDecimals"
                type="number"
                min="0"
                max="18"
                value={formData.tokenDecimals}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenDecimals: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Number of decimal places (0-18)</p>
            </div>

            {deploymentError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{deploymentError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Review Deployment
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 'review' && tokenDetails && claimDetails && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Review Deployment</h3>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-2">Token Details</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Name:</span> {tokenDetails.name}</p>
                <p><span className="font-medium">Symbol:</span> {tokenDetails.symbol}</p>
                <p><span className="font-medium">Decimals:</span> {tokenDetails.decimals}</p>
                <p><span className="font-medium">Owner:</span> {tokenDetails.owner}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">Default Configuration</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><span className="font-medium">Claim Topic:</span> KYC_VERIFIED</p>
                <p><span className="font-medium">Claim Issuer:</span> Pre-deployed ClaimIssuer</p>
                <p><span className="font-medium">Compliance:</span> Basic (no modules)</p>
                <p><span className="font-medium">Agents:</span> None (can be added later)</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-md p-4">
              <h4 className="font-medium text-green-900 mb-2">What Will Be Deployed</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>✅ Token Contract (ERC-3643 compliant)</p>
                <p>✅ Identity Registry</p>
                <p>✅ Identity Registry Storage</p>
                <p>✅ Trusted Issuers Registry</p>
                <p>✅ Claim Topics Registry</p>
                <p>✅ Modular Compliance Contract</p>
                <p>✅ Token OnchainID</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep('form')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Back to Edit
            </button>
            <button
              onClick={handleDeployment}
              disabled={isPending}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isPending ? 'Confirming...' : 'Deploy Token Suite'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Deploying */}
      {step === 'deploying' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Deploying Token Suite</h3>
          <p className="text-gray-600 mb-4">
            {isConfirming ? 'Waiting for transaction confirmation...' : 'Please confirm the transaction in your wallet'}
          </p>
          {hash && (
            <p className="text-xs text-gray-500 break-all">
              Transaction: {hash}
            </p>
          )}
        </div>
      )}

      {/* Step 4: Success */}
      {step === 'success' && (
        <div className="bg-white border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Token Suite Deployed Successfully!</h3>
          <p className="text-green-700 mb-4">
            Your T-REX security token "{formData.tokenName}" ({formData.tokenSymbol}) has been deployed.
          </p>
          {hash && (
            <div className="bg-green-50 rounded-md p-3 mb-4">
              <p className="text-sm text-green-700 break-all">
                <span className="font-medium">Transaction:</span> {hash}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <button
              onClick={resetForm}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Deploy Another Token
            </button>
            <p className="text-xs text-gray-500">
              Check the dashboard to view your deployed token details
            </p>
          </div>
        </div>
      )}

      {/* Step 5: Error */}
      {step === 'error' && (
        <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Deployment Failed</h3>
          <p className="text-red-700 mb-4">
            There was an error deploying your token suite.
          </p>
          {deploymentError && (
            <div className="bg-red-50 rounded-md p-3 mb-4">
              <p className="text-sm text-red-700">
                <span className="font-medium">Error:</span> {deploymentError}
              </p>
            </div>
          )}
          <div className="flex space-x-3">
            <button
              onClick={() => setStep('review')}
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
  );
}
