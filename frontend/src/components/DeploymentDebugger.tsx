import React, { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { 
  trexFactoryAbi, 
  trexFactoryAddress,
  claimIssuerContractAddress 
} from '../generated';
import { keccak256, stringToBytes, zeroAddress } from 'viem';

export function DeploymentDebugger() {
  const { address: userAddress, chainId } = useAccount();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Test form data
  const testFormData = {
    tokenName: 'DebugToken',
    tokenSymbol: 'DBG',
    tokenDecimals: 0
  };

  const generateSalt = (symbol: string) => {
    return `${symbol}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createTestTokenDetails = () => {
    return {
      owner: (userAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`,
      name: testFormData.tokenName,
      symbol: testFormData.tokenSymbol,
      decimals: Math.max(0, Math.min(18, Math.floor(testFormData.tokenDecimals))),
      irs: "0x598efcBD0B5b4Fd0142bEAae1a38f6Bd4d8a218d", // Reuse existing IRS from deployment
      ONCHAINID: zeroAddress,
      irAgents: [],
      tokenAgents: [],
      complianceModules: [],
      complianceSettings: []
    };
  };

  const createTestClaimDetails = () => {
    const kycTopic = BigInt(keccak256(stringToBytes('KYC_VERIFIED')));
    const currentChainId = chainId || 420420420;
    const claimIssuerAddress = claimIssuerContractAddress[currentChainId as keyof typeof claimIssuerContractAddress];
    
    return {
      claimTopics: [kycTopic],
      issuers: [claimIssuerAddress || userAddress || '0x0000000000000000000000000000000000000000'] as readonly `0x${string}`[],
      issuerClaims: [[kycTopic]]
    };
  };

  const convertToContractParams = (salt: string, tokenDetails: any, claimDetails: any) => {
    const contractTokenDetails = {
      ...tokenDetails,
      decimals: tokenDetails.decimals
    };

    const contractClaimDetails = {
      claimTopics: claimDetails.claimTopics.map((topic: bigint) => topic.toString()),
      issuers: claimDetails.issuers,
      issuerClaims: claimDetails.issuerClaims.map((claims: readonly bigint[]) => 
        claims.map((claim: bigint) => claim.toString())
      )
    };

    return [salt, contractTokenDetails, contractClaimDetails];
  };

  // Read factory owner
  const { data: factoryOwner } = useReadContract({
    address: trexFactoryAddress[chainId as keyof typeof trexFactoryAddress],
    abi: trexFactoryAbi,
    functionName: 'owner',
  });

  const runDiagnostics = () => {
    const salt = generateSalt(testFormData.tokenSymbol);
    const tokenDetails = createTestTokenDetails();
    const claimDetails = createTestClaimDetails();
    const contractArgs = convertToContractParams(salt, tokenDetails, claimDetails);

    const diagnostics = {
      // Basic info
      connectedWallet: userAddress,
      chainId: chainId,
      factoryAddress: trexFactoryAddress[chainId as keyof typeof trexFactoryAddress],
      factoryOwner: factoryOwner,
      isOwner: userAddress === factoryOwner,

      // Salt info
      generatedSalt: salt,
      saltLength: salt.length,

      // Token details validation
      tokenDetails: contractArgs[1],
      tokenDetailsValidation: {
        hasOwner: !!contractArgs[1].owner,
        hasName: !!contractArgs[1].name && contractArgs[1].name.length > 0,
        hasSymbol: !!contractArgs[1].symbol && contractArgs[1].symbol.length > 0,
        decimalsValid: contractArgs[1].decimals >= 0 && contractArgs[1].decimals <= 18,
        irAgentsCount: contractArgs[1].irAgents.length,
        tokenAgentsCount: contractArgs[1].tokenAgents.length,
        complianceModulesCount: contractArgs[1].complianceModules.length,
        complianceSettingsCount: contractArgs[1].complianceSettings.length,
        compliancePatternValid: contractArgs[1].complianceModules.length >= contractArgs[1].complianceSettings.length
      },

      // Claim details validation
      claimDetails: contractArgs[2],
      claimDetailsValidation: {
        claimTopicsCount: contractArgs[2].claimTopics.length,
        issuersCount: contractArgs[2].issuers.length,
        issuerClaimsCount: contractArgs[2].issuerClaims.length,
        claimPatternValid: contractArgs[2].issuers.length === contractArgs[2].issuerClaims.length,
        maxIssuersValid: contractArgs[2].issuers.length <= 5,
        maxTopicsValid: contractArgs[2].claimTopics.length <= 5,
        claimIssuerAddress: claimIssuerContractAddress[chainId as keyof typeof claimIssuerContractAddress],
      },

      // Contract requirements check
      contractRequirements: {
        maxAgents: contractArgs[1].irAgents.length <= 5 && contractArgs[1].tokenAgents.length <= 5,
        maxModules: contractArgs[1].complianceModules.length <= 30,
        validClaimPattern: contractArgs[2].issuers.length === contractArgs[2].issuerClaims.length,
        maxIssuers: contractArgs[2].issuers.length <= 5,
        maxTopics: contractArgs[2].claimTopics.length <= 5,
        validCompliancePattern: contractArgs[1].complianceModules.length >= contractArgs[1].complianceSettings.length
      }
    };

    setDebugInfo(diagnostics);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Deployment Debugger</h2>
      
      <button
        onClick={runDiagnostics}
        className="mb-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
      >
        Run Diagnostics
      </button>

      {debugInfo && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Connected Wallet: {debugInfo.connectedWallet}</div>
              <div>Chain ID: {debugInfo.chainId}</div>
              <div>Factory Address: {debugInfo.factoryAddress}</div>
              <div>Factory Owner: {debugInfo.factoryOwner}</div>
              <div className={debugInfo.isOwner ? 'text-green-600' : 'text-red-600'}>
                Is Owner: {debugInfo.isOwner ? '✅ YES' : '❌ NO'}
              </div>
            </div>
          </div>

          {/* Contract Requirements */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Contract Requirements Check</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(debugInfo.contractRequirements).map(([key, value]) => (
                <div key={key} className={value ? 'text-green-600' : 'text-red-600'}>
                  {key}: {value ? '✅ PASS' : '❌ FAIL'}
                </div>
              ))}
            </div>
          </div>

          {/* Token Details */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Token Details Validation</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(debugInfo.tokenDetailsValidation).map(([key, value]) => (
                <div key={key} className={value ? 'text-green-600' : 'text-red-600'}>
                  {key}: {String(value)} {typeof value === 'boolean' ? (value ? '✅' : '❌') : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Claim Details */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Claim Details Validation</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(debugInfo.claimDetailsValidation).map(([key, value]) => (
                <div key={key} className={value ? 'text-green-600' : 'text-red-600'}>
                  {key}: {String(value)} {typeof value === 'boolean' ? (value ? '✅' : '❌') : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Raw Data */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Raw Contract Parameters</h3>
            <div className="text-xs">
              <div className="mb-4">
                <h4 className="font-medium">Salt:</h4>
                <pre className="bg-white p-2 rounded border overflow-x-auto">{debugInfo.generatedSalt}</pre>
              </div>
              <div className="mb-4">
                <h4 className="font-medium">Token Details:</h4>
                <pre className="bg-white p-2 rounded border overflow-x-auto">{JSON.stringify(debugInfo.tokenDetails, null, 2)}</pre>
              </div>
              <div>
                <h4 className="font-medium">Claim Details:</h4>
                <pre className="bg-white p-2 rounded border overflow-x-auto">{JSON.stringify(debugInfo.claimDetails, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
