import React, { useState, useCallback, useMemo } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  trexFactoryAbi, 
  trexFactoryAddress,
  claimIssuerContractAddress
} from '../generated';
import { encodeFunctionData, keccak256, stringToHex, zeroAddress } from 'viem';

// Available compliance modules (these would need to be deployed first)
const COMPLIANCE_MODULES = {
  COUNTRY_ALLOW: '0x0000000000000000000000000000000000000000', // Placeholder - would need real addresses
  MAX_BALANCE: '0x0000000000000000000000000000000000000000',
  EXCHANGE_LIMITS: '0x0000000000000000000000000000000000000000',
} as const;

// Form interfaces based on T-REX factory structs
interface TokenDetailsForm {
  owner: string;
  name: string;
  symbol: string;
  decimals: number;
  irs: string; // Set to zero address for new deployment
  ONCHAINID: string; // Set to zero address for auto-deployment
  irAgents: string[];
  tokenAgents: string[];
  complianceModules: string[];
  complianceSettings: string[];
}

interface ClaimDetailsForm {
  claimTopics: string[];
  issuers: string[];
  issuerClaims: string[][];
}

interface ComplianceModule {
  id: string;
  name: string;
  description: string;
  address: string;
  requiresSettings: boolean;
  settingsSchema?: {
    functionName: string;
    parameters: Array<{
      name: string;
      type: string;
      description: string;
    }>;
  };
}

type DeploymentStep = 'form' | 'review' | 'deploying' | 'success' | 'error';

const AVAILABLE_MODULES: ComplianceModule[] = [
  {
    id: 'country_allow',
    name: 'Country Allow Module',
    description: 'Restrict token transfers to specific countries',
    address: COMPLIANCE_MODULES.COUNTRY_ALLOW,
    requiresSettings: true,
    settingsSchema: {
      functionName: 'batchAllowCountries',
      parameters: [
        { name: 'countries', type: 'uint16[]', description: 'Array of allowed country codes (ISO 3166-1 numeric)' }
      ]
    }
  },
  {
    id: 'max_balance',
    name: 'Maximum Balance Module',
    description: 'Set maximum token balance per investor',
    address: COMPLIANCE_MODULES.MAX_BALANCE,
    requiresSettings: true,
    settingsSchema: {
      functionName: 'setMaxBalance',
      parameters: [
        { name: 'maxBalance', type: 'uint256', description: 'Maximum balance allowed per investor' }
      ]
    }
  }
];

export function FactoryDeployToken() {
  const { address: userAddress, chainId } = useAccount();
  const { writeContract, data: hash, error: deployError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({ hash });

  const [step, setStep] = useState<DeploymentStep>('form');
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [deployedAddresses, setDeployedAddresses] = useState<{
    token?: string;
    identityRegistry?: string;
    compliance?: string;
  }>({});

  // Form state
  const [tokenDetails, setTokenDetails] = useState<TokenDetailsForm>({
    owner: userAddress || '',
    name: '',
    symbol: '',
    decimals: 18,
    irs: zeroAddress,
    ONCHAINID: zeroAddress,
    irAgents: [],
    tokenAgents: [],
    complianceModules: [],
    complianceSettings: []
  });

  const [claimDetails, setClaimDetails] = useState<ClaimDetailsForm>({
    claimTopics: [],
    issuers: [],
    issuerClaims: []
  });

  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [moduleSettings, setModuleSettings] = useState<Record<string, any>>({});
  
  // Agent management
  const [newIRAgent, setNewIRAgent] = useState('');
  const [newTokenAgent, setNewTokenAgent] = useState('');
  
  // Claim management
  const [newClaimTopic, setNewClaimTopic] = useState('');

  // Generate unique salt based on user address and timestamp
  const salt = useMemo(() => {
    if (!userAddress || !tokenDetails.name) return '';
    return `${userAddress}_${tokenDetails.name}_${Date.now()}`.slice(0, 32);
  }, [userAddress, tokenDetails.name]);

  // Update owner when wallet changes
  React.useEffect(() => {
    if (userAddress && tokenDetails.owner !== userAddress) {
      setTokenDetails(prev => ({ ...prev, owner: userAddress }));
    }
  }, [userAddress, tokenDetails.owner]);

  // Validation
  const validateForm = useCallback((): string | null => {
    if (!tokenDetails.name.trim()) return 'Token name is required';
    if (!tokenDetails.symbol.trim()) return 'Token symbol is required';
    if (tokenDetails.symbol.length < 2 || tokenDetails.symbol.length > 6) {
      return 'Token symbol must be 2-6 characters';
    }
    if (tokenDetails.decimals < 0 || tokenDetails.decimals > 18) {
      return 'Token decimals must be between 0 and 18';
    }
    if (!userAddress) return 'Please connect your wallet';
    
    // Validate agents
    if (tokenDetails.irAgents.length > 5) return 'Maximum 5 IR agents allowed';
    if (tokenDetails.tokenAgents.length > 5) return 'Maximum 5 token agents allowed';
    
    // Validate claims
    if (claimDetails.claimTopics.length > 5) return 'Maximum 5 claim topics allowed';
    if (claimDetails.issuers.length > 5) return 'Maximum 5 trusted issuers allowed';
    if (claimDetails.issuers.length !== claimDetails.issuerClaims.length) {
      return 'Each issuer must have corresponding claims';
    }
    
    // Validate compliance modules
    if (selectedModules.length > 30) return 'Maximum 30 compliance modules allowed';
    
    return null;
  }, [tokenDetails, claimDetails, selectedModules, userAddress]);

  // Generate compliance settings
  const generateComplianceSettings = useCallback(() => {
    const settings: string[] = [];
    
    selectedModules.forEach(moduleId => {
      const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
      if (!module?.requiresSettings || !module.settingsSchema) return;
      
      const moduleConfig = moduleSettings[moduleId];
      if (!moduleConfig) return;
      
      try {
        // Generate encoded function call for module settings
        if (module.settingsSchema.functionName === 'batchAllowCountries') {
          const countries = moduleConfig.countries || [];
          if (countries.length > 0) {
            const encoded = encodeFunctionData({
              abi: [{
                type: 'function',
                name: 'batchAllowCountries',
                inputs: [{ name: 'countries', type: 'uint16[]' }]
              }],
              functionName: 'batchAllowCountries',
              args: [countries]
            });
            settings.push(encoded);
          }
        } else if (module.settingsSchema.functionName === 'setMaxBalance') {
          const maxBalance = moduleConfig.maxBalance;
          if (maxBalance && maxBalance > 0) {
            const encoded = encodeFunctionData({
              abi: [{
                type: 'function',
                name: 'setMaxBalance',
                inputs: [{ name: 'maxBalance', type: 'uint256' }]
              }],
              functionName: 'setMaxBalance',
              args: [BigInt(maxBalance)]
            });
            settings.push(encoded);
          }
        }
      } catch (error) {
        console.warn(`Failed to encode settings for module ${moduleId}:`, error);
      }
    });
    
    return settings;
  }, [selectedModules, moduleSettings]);

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setDeploymentError(validationError);
      return;
    }

    // Update compliance modules and settings
    const moduleAddresses = selectedModules
      .map(id => AVAILABLE_MODULES.find(m => m.id === id)?.address)
      .filter(Boolean) as string[];
    
    const settings = generateComplianceSettings();

    setTokenDetails(prev => ({
      ...prev,
      complianceModules: moduleAddresses,
      complianceSettings: settings
    }));

    setDeploymentError(null);
    setStep('review');
  };

  // Handle deployment
  const handleDeployment = async () => {
    if (!userAddress || !chainId) {
      setDeploymentError('Wallet not connected');
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

      // Prepare contract arguments
      const tokenDetailsArgs = {
        owner: tokenDetails.owner as `0x${string}`,
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        decimals: tokenDetails.decimals,
        irs: tokenDetails.irs as `0x${string}`,
        ONCHAINID: tokenDetails.ONCHAINID as `0x${string}`,
        irAgents: tokenDetails.irAgents as `0x${string}`[],
        tokenAgents: tokenDetails.tokenAgents as `0x${string}`[],
        complianceModules: tokenDetails.complianceModules as `0x${string}`[],
        complianceSettings: tokenDetails.complianceSettings as `0x${string}`[]
      };

      const claimDetailsArgs = {
        claimTopics: claimDetails.claimTopics.map(topic => 
          topic.startsWith('0x') ? BigInt(topic) : BigInt(keccak256(stringToHex(topic)))
        ),
        issuers: claimDetails.issuers as `0x${string}`[],
        issuerClaims: claimDetails.issuerClaims.map(claims => 
          claims.map(claim => 
            claim.startsWith('0x') ? BigInt(claim) : BigInt(keccak256(stringToHex(claim)))
          )
        )
      };

      await writeContract({
        address: factoryAddress,
        abi: trexFactoryAbi,
        functionName: 'deployTREXSuite',
        args: [salt, tokenDetailsArgs, claimDetailsArgs]
      });
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentError(error instanceof Error ? error.message : 'Unknown deployment error');
      setStep('error');
    }
  };

  // Handle success
  React.useEffect(() => {
    if (isSuccess && step === 'deploying' && receipt) {
      // Extract deployed addresses from event logs
      try {
        const deploymentEvent = receipt.logs.find(log => 
          log.topics[0] === keccak256(stringToHex('TREXSuiteDeployed(address,address,address,address,address,address,string)'))
        );
        
        if (deploymentEvent && deploymentEvent.topics[1]) {
          setDeployedAddresses({
            token: deploymentEvent.topics[1],
            // Additional addresses could be extracted from log data
          });
        }
        setStep('success');
      } catch (error) {
        console.warn('Could not parse deployment event:', error);
        setStep('success'); // Still show success even if we can't parse addresses
      }
    }
  }, [isSuccess, step, receipt]);

  // Handle error
  React.useEffect(() => {
    if (deployError && step === 'deploying') {
      setDeploymentError(deployError.message);
      setStep('error');
    }
  }, [deployError, step]);

  // Helper functions for managing arrays
  const addIRAgent = () => {
    if (newIRAgent && tokenDetails.irAgents.length < 5) {
      setTokenDetails(prev => ({
        ...prev,
        irAgents: [...prev.irAgents, newIRAgent]
      }));
      setNewIRAgent('');
    }
  };

  const removeIRAgent = (index: number) => {
    setTokenDetails(prev => ({
      ...prev,
      irAgents: prev.irAgents.filter((_, i) => i !== index)
    }));
  };

  const addTokenAgent = () => {
    if (newTokenAgent && tokenDetails.tokenAgents.length < 5) {
      setTokenDetails(prev => ({
        ...prev,
        tokenAgents: [...prev.tokenAgents, newTokenAgent]
      }));
      setNewTokenAgent('');
    }
  };

  const removeTokenAgent = (index: number) => {
    setTokenDetails(prev => ({
      ...prev,
      tokenAgents: prev.tokenAgents.filter((_, i) => i !== index)
    }));
  };

  const addClaimTopic = () => {
    if (newClaimTopic && claimDetails.claimTopics.length < 5) {
      setClaimDetails(prev => ({
        ...prev,
        claimTopics: [...prev.claimTopics, newClaimTopic]
      }));
      setNewClaimTopic('');
    }
  };

  const removeClaimTopic = (index: number) => {
    setClaimDetails(prev => ({
      ...prev,
      claimTopics: prev.claimTopics.filter((_, i) => i !== index)
    }));
  };

  const addTrustedIssuer = () => {
    const currentChainId = chainId || 420420420;
    const issuerAddress = claimIssuerContractAddress[currentChainId as keyof typeof claimIssuerContractAddress];
    
    if (issuerAddress && claimDetails.issuers.length < 5) {
      setClaimDetails(prev => ({
        ...prev,
        issuers: [...prev.issuers, issuerAddress],
        issuerClaims: [...prev.issuerClaims, claimDetails.claimTopics] // Default to all claim topics
      }));
    }
  };

  const removeTrustedIssuer = (index: number) => {
    setClaimDetails(prev => ({
      ...prev,
      issuers: prev.issuers.filter((_, i) => i !== index),
      issuerClaims: prev.issuerClaims.filter((_, i) => i !== index)
    }));
  };

  const toggleComplianceModule = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const updateModuleSettings = (moduleId: string, settings: any) => {
    setModuleSettings(prev => ({
      ...prev,
      [moduleId]: settings
    }));
  };

  const resetForm = () => {
    setStep('form');
    setDeploymentError(null);
    setDeployedAddresses({});
    setTokenDetails({
      owner: userAddress || '',
      name: '',
      symbol: '',
      decimals: 18,
      irs: zeroAddress,
      ONCHAINID: zeroAddress,
      irAgents: [],
      tokenAgents: [],
      complianceModules: [],
      complianceSettings: []
    });
    setClaimDetails({
      claimTopics: [],
      issuers: [],
      issuerClaims: []
    });
    setSelectedModules([]);
    setModuleSettings({});
  };

  // Render different steps
  if (step === 'success') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800">Token Suite Deployed Successfully!</h2>
          </div>
          
          <div className="space-y-3 mb-6">
            <p className="text-green-700">
              Your complete T-REX security token suite has been deployed with the following configuration:
            </p>
            <div className="bg-white rounded-md p-4 space-y-2">
              <p><span className="font-semibold">Token Name:</span> {tokenDetails.name}</p>
              <p><span className="font-semibold">Symbol:</span> {tokenDetails.symbol}</p>
              <p><span className="font-semibold">Decimals:</span> {tokenDetails.decimals}</p>
              <p><span className="font-semibold">Salt:</span> <code className="text-sm bg-gray-100 px-1 rounded">{salt}</code></p>
              {deployedAddresses.token && (
                <p><span className="font-semibold">Token Address:</span> <code className="text-sm bg-gray-100 px-1 rounded">{deployedAddresses.token}</code></p>
              )}
              {hash && (
                <p><span className="font-semibold">Transaction:</span> <code className="text-sm bg-gray-100 px-1 rounded">{hash}</code></p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-green-800">What was deployed:</h3>
            <ul className="list-disc list-inside text-green-700 space-y-1">
              <li>Security Token Contract</li>
              <li>Identity Registry</li>
              <li>Identity Registry Storage</li>
              <li>Trusted Issuers Registry</li>
              <li>Claim Topics Registry</li>
              <li>Modular Compliance Contract</li>
              {selectedModules.length > 0 && <li>{selectedModules.length} Compliance Module(s) configured</li>}
              {tokenDetails.ONCHAINID === zeroAddress && <li>Token On-Chain Identity (auto-generated)</li>}
            </ul>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={resetForm}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Deploy Another Token
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800">Deployment Failed</h2>
          </div>
          
          {deploymentError && (
            <div className="bg-white rounded-md p-4 mb-6">
              <p className="text-red-700 font-mono text-sm">{deploymentError}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setStep('review')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Review
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'deploying') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-800">Deploying Token Suite...</h2>
          </div>
          
          <div className="space-y-3">
            <p className="text-blue-700">
              {isPending ? 'Waiting for transaction confirmation...' : 
               isConfirming ? 'Transaction confirmed, waiting for deployment...' :
               'Preparing deployment...'}
            </p>
            
            <div className="bg-white rounded-md p-4">
              <div className="space-y-2">
                <p className="text-sm"><span className="font-semibold">Token:</span> {tokenDetails.name} ({tokenDetails.symbol})</p>
                <p className="text-sm"><span className="font-semibold">Salt:</span> <code className="bg-gray-100 px-1 rounded">{salt}</code></p>
                {hash && (
                  <p className="text-sm"><span className="font-semibold">Transaction:</span> <code className="bg-gray-100 px-1 rounded">{hash}</code></p>
                )}
              </div>
            </div>

            <div className="text-sm text-blue-600">
              <p>⏳ This may take a few minutes depending on network conditions.</p>
              <p>💡 Your complete T-REX suite is being deployed in a single transaction.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Review Deployment Configuration</h2>
          
          {/* Token Details Review */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Token Details</h3>
            <div className="bg-gray-50 rounded-md p-4 space-y-2">
              <p><span className="font-semibold">Name:</span> {tokenDetails.name}</p>
              <p><span className="font-semibold">Symbol:</span> {tokenDetails.symbol}</p>
              <p><span className="font-semibold">Decimals:</span> {tokenDetails.decimals}</p>
              <p><span className="font-semibold">Owner:</span> <code className="text-sm">{tokenDetails.owner}</code></p>
              <p><span className="font-semibold">Salt:</span> <code className="text-sm">{salt}</code></p>
            </div>
          </div>

          {/* Agents Review */}
          {(tokenDetails.irAgents.length > 0 || tokenDetails.tokenAgents.length > 0) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Authorized Agents</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-3">
                {tokenDetails.irAgents.length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">Identity Registry Agents:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {tokenDetails.irAgents.map((agent, index) => (
                        <li key={index}><code>{agent}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
                {tokenDetails.tokenAgents.length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">Token Agents:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {tokenDetails.tokenAgents.map((agent, index) => (
                        <li key={index}><code>{agent}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compliance Modules Review */}
          {selectedModules.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Compliance Modules</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-2">
                {selectedModules.map(moduleId => {
                  const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
                  return (
                    <div key={moduleId}>
                      <p className="font-semibold">{module?.name}</p>
                      <p className="text-sm text-gray-600">{module?.description}</p>
                      {moduleSettings[moduleId] && (
                        <div className="text-sm text-gray-700 mt-1">
                          Settings: <code className="bg-white px-1 rounded">{JSON.stringify(moduleSettings[moduleId])}</code>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Claims Review */}
          {(claimDetails.claimTopics.length > 0 || claimDetails.issuers.length > 0) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Claim Configuration</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-3">
                {claimDetails.claimTopics.length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">Required Claim Topics:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {claimDetails.claimTopics.map((topic, index) => (
                        <li key={index}><code>{topic}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
                {claimDetails.issuers.length > 0 && (
                  <div>
                    <p className="font-semibold mb-1">Trusted Issuers:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {claimDetails.issuers.map((issuer, index) => (
                        <li key={index}><code>{issuer}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gas Estimate */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Deployment Information</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start">
                <div className="bg-yellow-100 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-yellow-800 font-semibold">Estimated Gas Cost</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    This deployment will create 6+ contracts in a single transaction. 
                    Expected gas usage: ~1.6M - 2.8M gas depending on configuration.
                  </p>
                  <p className="text-yellow-700 text-sm">
                    At current network conditions, this may cost $150-$1200 depending on gas price.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {deploymentError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700 font-mono text-sm">{deploymentError}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setStep('form')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Form
            </button>
            <button
              onClick={handleDeployment}
              disabled={isPending || isConfirming}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {isPending || isConfirming ? 'Deploying...' : 'Deploy Token Suite'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Deploy T-REX Security Token Suite</h2>
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800 text-sm">
            ✨ <span className="font-semibold">Factory Deployment:</span> This will deploy a complete T-REX security token ecosystem 
            including Token, Identity Registry, Compliance Engine, and all supporting contracts in a single transaction.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Basic Token Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Token Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token Name *</label>
                <input
                  type="text"
                  value={tokenDetails.name}
                  onChange={(e) => setTokenDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., My Security Token"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token Symbol *</label>
                <input
                  type="text"
                  value={tokenDetails.symbol}
                  onChange={(e) => setTokenDetails(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  placeholder="e.g., MST"
                  maxLength={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Decimals</label>
                <input
                  type="number"
                  value={tokenDetails.decimals}
                  onChange={(e) => setTokenDetails(prev => ({ ...prev, decimals: parseInt(e.target.value) || 0 }))}
                  min="0"
                  max="18"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Address</label>
                <input
                  type="text"
                  value={tokenDetails.owner}
                  onChange={(e) => setTokenDetails(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="0x..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Automatically set to your connected wallet</p>
              </div>
            </div>
          </div>

          {/* Identity Registry Agents */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Identity Registry Agents</h3>
            <p className="text-sm text-gray-600 mb-3">
              Agents can manage investor identities and perform administrative functions. Maximum 5 agents.
            </p>
            
            <div className="space-y-3">
              {tokenDetails.irAgents.map((agent, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={agent}
                    readOnly
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => removeIRAgent(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              {tokenDetails.irAgents.length < 5 && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newIRAgent}
                    onChange={(e) => setNewIRAgent(e.target.value)}
                    placeholder="0x... (Agent address)"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addIRAgent}
                    disabled={!newIRAgent}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Token Agents */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Token Agents</h3>
            <p className="text-sm text-gray-600 mb-3">
              Agents can perform token operations like minting, burning, and transfers. Maximum 5 agents.
            </p>
            
            <div className="space-y-3">
              {tokenDetails.tokenAgents.map((agent, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={agent}
                    readOnly
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => removeTokenAgent(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              {tokenDetails.tokenAgents.length < 5 && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTokenAgent}
                    onChange={(e) => setNewTokenAgent(e.target.value)}
                    placeholder="0x... (Agent address)"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTokenAgent}
                    disabled={!newTokenAgent}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Compliance Modules */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Compliance Modules</h3>
            <p className="text-sm text-gray-600 mb-3">
              Select compliance rules to enforce for your security token.
            </p>
            
            <div className="space-y-4">
              {AVAILABLE_MODULES.map(module => (
                <div key={module.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id={module.id}
                      checked={selectedModules.includes(module.id)}
                      onChange={() => toggleComplianceModule(module.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={module.id} className="font-medium text-gray-900 cursor-pointer">
                        {module.name}
                      </label>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      
                      {selectedModules.includes(module.id) && module.requiresSettings && module.settingsSchema && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium text-gray-700 mb-2">Module Settings:</p>
                          {module.settingsSchema.functionName === 'batchAllowCountries' && (
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">
                                Allowed Countries (ISO 3166-1 numeric codes)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., 840,124,276 (USA, Canada, Germany)"
                                onChange={(e) => {
                                  const countries = e.target.value
                                    .split(',')
                                    .map(c => parseInt(c.trim()))
                                    .filter(c => !isNaN(c));
                                  updateModuleSettings(module.id, { countries });
                                }}
                                className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          )}
                          {module.settingsSchema.functionName === 'setMaxBalance' && (
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">
                                Maximum Balance (in token units)
                              </label>
                              <input
                                type="number"
                                placeholder="e.g., 1000000"
                                onChange={(e) => {
                                  const maxBalance = parseInt(e.target.value) || 0;
                                  updateModuleSettings(module.id, { maxBalance });
                                }}
                                className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {AVAILABLE_MODULES.every(m => m.address === '0x0000000000000000000000000000000000000000') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ <span className="font-semibold">Note:</span> Compliance modules need to be deployed first. 
                    For now, you can deploy without modules and add them later.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Claim Configuration */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Claim Requirements</h3>
            <p className="text-sm text-gray-600 mb-3">
              Define what claims investors need to hold the token. Maximum 5 claim topics and 5 trusted issuers.
            </p>
            
            {/* Claim Topics */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Required Claim Topics</h4>
              <div className="space-y-2">
                {claimDetails.claimTopics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={topic}
                      readOnly
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeClaimTopic(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                {claimDetails.claimTopics.length < 5 && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newClaimTopic}
                      onChange={(e) => setNewClaimTopic(e.target.value)}
                      placeholder="e.g., KYC_VERIFIED or 0x1234..."
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={addClaimTopic}
                      disabled={!newClaimTopic}
                      className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors text-sm"
                    >
                      Add Topic
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Trusted Issuers */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Trusted Claim Issuers</h4>
              <div className="space-y-2">
                {claimDetails.issuers.map((issuer, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={issuer}
                      readOnly
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeTrustedIssuer(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                {claimDetails.issuers.length < 5 && claimIssuerContractAddress[(chainId || 420420420) as keyof typeof claimIssuerContractAddress] && (
                  <button
                    type="button"
                    onClick={addTrustedIssuer}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm"
                  >
                    Add Default Claim Issuer
                  </button>
                )}
              </div>
            </div>
          </div>

          {deploymentError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700 text-sm">{deploymentError}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Review Deployment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
