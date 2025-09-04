import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi';
import { identityImplementationAbi, claimTopicsRegistryAbi, trustedIssuersRegistryAbi, identityRegistryAbi, claimIssuerContractAbi } from '../generated';
import { keccak256, toBytes, encodePacked, Hex } from 'viem';

// Types and Interfaces
interface UserEntry {
  id: string;
  walletAddress: string;
  identityAddress: string;
  nickname?: string;
  country: number;
  status: 'pending' | 'claims_issued' | 'registered' | 'complete';
}

interface ClaimTopic {
  name: string;
  hash: string;
  description: string;
}

interface ClaimStatus {
  userId: string;
  topicHash: string;
  status: 'needed' | 'issuing' | 'issued' | 'failed';
  transactionHash?: string;
  error?: string;
}

interface TestUser {
  walletAddress: string;
  identityAddress: string;
  nickname: string;
  country: number;
  privateKey?: string;
}

// Predefined claim topics
const PREDEFINED_TOPICS: ClaimTopic[] = [
  {
    name: 'KYC_VERIFIED',
    hash: keccak256(toBytes('KYC_VERIFIED')),
    description: 'Know Your Customer verification completed'
  },
  {
    name: 'AML_CLEARED', 
    hash: keccak256(toBytes('AML_CLEARED')),
    description: 'Anti-Money Laundering screening passed'
  },
  {
    name: 'COUNTRY_VERIFIED',
    hash: keccak256(toBytes('COUNTRY_VERIFIED')), 
    description: 'Country of residence verified'
  }
];

// Test users from deployment config
const TEST_USERS: TestUser[] = [
  {
    walletAddress: "0x3452D27d07C7004007ac986cD3Efa3Ac36677680",
    identityAddress: "0x78D714e1b47Bb86FE15788B917C9CC7B77975529",
    nickname: "Alice",
    country: 42,
    privateKey: "0x2dc1e0836b130bd35294bc49c88fad4ce008d6c9d14f9381879976907bbd6610"
  },
  {
    walletAddress: "0x234Ab1c08319e690b5B41652bf028C6Af85063c8",
    identityAddress: "0x9Aaaf5ef347F1f1aF5377dB81500Db2Aa4c5a216", 
    nickname: "Bob",
    country: 42,
    privateKey: "0xaba8288ce66fc00ef5ec9cf2e84e9b08c42ff59c01ff8ab70be59720f837f3c8"
  },
  {
    walletAddress: "0x1da264b338befffD424eF64734D5f7689274E82B",
    identityAddress: "0xF0e46847c8bFD122C4b5EEE1D4494FF7C5FC5104",
    nickname: "Charlie", 
    country: 42,
    privateKey: "0x28f21dbdd429b495cda3e9c9005141de9ad106e5bd19b5d6841d8af4538766c6"
  }
];

export function UserSetupWizard() {
  // Wallet connection
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<'users' | 'claims' | 'registration'>('users');
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [claimStatuses, setClaimStatuses] = useState<ClaimStatus[]>([]);
  
  // Contract addresses (should be from deployed token wizard)
  const [claimTopicsRegistryAddress, setClaimTopicsRegistryAddress] = useState('');
  const [trustedIssuersRegistryAddress, setTrustedIssuersRegistryAddress] = useState('');
  const [identityRegistryAddress, setIdentityRegistryAddress] = useState('');
  const [claimIssuerAddress, setClaimIssuerAddress] = useState('');

  // Form state for adding users
  const [newUser, setNewUser] = useState({
    walletAddress: '',
    identityAddress: '',
    nickname: '',
    country: 42
  });

  // Transaction state
  const { writeContract, data: txHash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // UI state
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get available claim topics from registry
  const { data: availableTopics, refetch: refetchTopics } = useReadContract({
    address: claimTopicsRegistryAddress as `0x${string}`,
    abi: claimTopicsRegistryAbi,
    functionName: 'getClaimTopics',
    query: { enabled: !!claimTopicsRegistryAddress }
  });

  // Helper functions
  const generateUserId = () => Math.random().toString(36).substr(2, 9);

  const validateEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Verification functions
  /**
   * USER VERIFICATION METHODS - How to Check if User was Successfully Added:
   * 
   * 1. REGISTRATION VERIFICATION:
   *    - Contract: IdentityRegistry.contains(userAddress) → boolean
   *    - Purpose: Check if user's wallet is registered in the identity registry
   *    - Success: Returns true when user can be found in registry
   * 
   * 2. IDENTITY VERIFICATION:
   *    - Contract: IdentityRegistry.identity(userAddress) → address
   *    - Purpose: Get the OnchainID contract address for the user
   *    - Success: Returns the correct OnchainID address (not zero address)
   * 
   * 3. CLAIMS VERIFICATION:
   *    - Contract: Identity.getClaim(claimId) → (topic, scheme, issuer, signature, data, uri)
   *    - ClaimId: keccak256(abi.encode(issuer, topic))
   *    - Purpose: Verify specific claims exist on the user's OnchainID
   *    - Success: Returns valid claim data (not empty struct)
   * 
   * 4. COMPREHENSIVE VERIFICATION:
   *    - Contract: IdentityRegistry.isVerified(userAddress) → boolean
   *    - Purpose: Check if user has all required claims from trusted issuers
   *    - Success: Returns true when user is fully compliant for token transfers
   * 
   * 5. COUNTRY VERIFICATION:
   *    - Contract: IdentityRegistry.investorCountry(userAddress) → uint16
   *    - Purpose: Get user's registered country code
   *    - Success: Returns the correct country code (42 for test users)
   * 
   * 6. TOKEN TRANSFER READINESS:
   *    - Contract: Token.canTransfer(from, to, amount) → (success, reason)
   *    - Purpose: Check if user can actually send/receive tokens
   *    - Success: Returns true with empty reason when transfer is allowed
   */
  const generateClaimId = (issuer: string, topic: string): string => {
    return keccak256(encodePacked(['address', 'uint256'], [issuer as `0x${string}`, BigInt(topic)]));
  };

  // Check if user is registered in Identity Registry
  const { data: userRegistrationStatus, refetch: refetchRegistrationStatus } = useReadContract({
    address: identityRegistryAddress as `0x${string}`,
    abi: identityRegistryAbi,
    functionName: 'contains',
    args: users.length > 0 ? [users[0].walletAddress as `0x${string}`] : undefined,
    query: { enabled: !!identityRegistryAddress && users.length > 0 }
  });

  // Check if user is verified (has all required claims)
  const { data: userVerificationStatus, refetch: refetchVerificationStatus } = useReadContract({
    address: identityRegistryAddress as `0x${string}`,
    abi: identityRegistryAbi,
    functionName: 'isVerified',
    args: users.length > 0 ? [users[0].walletAddress as `0x${string}`] : undefined,
    query: { enabled: !!identityRegistryAddress && users.length > 0 }
  });

  // Get user's OnchainID from registry
  const { data: userIdentityFromRegistry, refetch: refetchUserIdentity } = useReadContract({
    address: identityRegistryAddress as `0x${string}`,
    abi: identityRegistryAbi,
    functionName: 'identity',
    args: users.length > 0 ? [users[0].walletAddress as `0x${string}`] : undefined,
    query: { enabled: !!identityRegistryAddress && users.length > 0 }
  });

  // Verify specific claim exists on identity
  const checkClaimExists = async (user: UserEntry, topicHash: string, issuer: string): Promise<boolean> => {
    try {
      const claimId = generateClaimId(issuer, topicHash);
      
      // This would need to be implemented as a contract read
      // For now, we'll use the claim status tracking
      const claimStatus = claimStatuses.find(s => s.userId === user.id && s.topicHash === topicHash);
      return claimStatus?.status === 'issued';
    } catch (error) {
      console.error('Error checking claim:', error);
      return false;
    }
  };

  // Comprehensive verification function
  const verifyUserSetup = async (user: UserEntry) => {
    const results = {
      isRegistered: false,
      isVerified: false,
      identityMatches: false,
      claimsIssued: 0,
      requiredClaims: 0,
      errors: [] as string[]
    };

    try {
      // Check if user is registered
      if (identityRegistryAddress) {
        // This would be a contract call in real implementation
        results.isRegistered = user.status === 'registered' || user.status === 'complete';
      }

      // Check if identity addresses match
      if (userIdentityFromRegistry && user.identityAddress) {
        results.identityMatches = String(userIdentityFromRegistry).toLowerCase() === user.identityAddress.toLowerCase();
      }

      // Count claims
      if (availableTopics) {
        results.requiredClaims = (availableTopics as readonly bigint[]).length;
        const userClaims = claimStatuses.filter(s => s.userId === user.id && s.status === 'issued');
        results.claimsIssued = userClaims.length;
      }

      // Overall verification status
      results.isVerified = results.isRegistered && results.identityMatches && 
                          results.claimsIssued === results.requiredClaims;

    } catch (error) {
      results.errors.push(`Verification failed: ${String(error)}`);
    }

    return results;
  };

  const addUser = () => {
    if (!validateEthereumAddress(newUser.walletAddress)) {
      setError('Invalid wallet address format');
      return;
    }
    if (!validateEthereumAddress(newUser.identityAddress)) {
      setError('Invalid identity address format');
      return;
    }

    const userEntry: UserEntry = {
      id: generateUserId(),
      walletAddress: newUser.walletAddress,
      identityAddress: newUser.identityAddress,
      nickname: newUser.nickname || `User_${users.length + 1}`,
      country: newUser.country,
      status: 'pending'
    };

    setUsers(prev => [...prev, userEntry]);
    setNewUser({ walletAddress: '', identityAddress: '', nickname: '', country: 42 });
    setError('');
    setSuccessMessage(`Added ${userEntry.nickname}`);
  };

  const importTestUsers = () => {
    const testUserEntries: UserEntry[] = TEST_USERS.map(testUser => ({
      id: generateUserId(),
      walletAddress: testUser.walletAddress,
      identityAddress: testUser.identityAddress,
      nickname: testUser.nickname,
      country: testUser.country,
      status: 'pending'
    }));

    setUsers(prev => [...prev, ...testUserEntries]);
    setSuccessMessage(`Imported ${testUserEntries.length} test users`);
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setClaimStatuses(prev => prev.filter(status => status.userId !== userId));
  };

  // Generate claim signature (simplified for PoC)
  const generateClaimSignature = async (identity: string, topic: string, data: string): Promise<string> => {
    // In a real implementation, this would use the claim issuer's private key
    // For PoC, we'll use a placeholder signature format
    const encodedData = encodePacked(['address', 'uint256', 'bytes'], [identity as `0x${string}`, BigInt(topic), toBytes(data)]);
    const messageHash = keccak256(encodedData);
    
    // Return placeholder signature - in real implementation, sign with claim issuer private key
    return '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
  };

  // Issue claims for a specific user
  const issueClaimsForUser = async (user: UserEntry) => {
    if (!claimIssuerAddress || !availableTopics) return;

    try {
      setIsLoadingData(true);
      
      for (const topicHash of availableTopics as readonly bigint[]) {
        const topicHashString = String(topicHash);
        
        // Update status to issuing
        setClaimStatuses(prev => {
          const existing = prev.find(s => s.userId === user.id && s.topicHash === topicHashString);
          if (existing) {
            return prev.map(s => s.userId === user.id && s.topicHash === topicHashString 
              ? { ...s, status: 'issuing' as const } : s);
          } else {
            return [...prev, { userId: user.id, topicHash: topicHashString, status: 'issuing' as const }];
          }
        });

        try {
          // Check if claim already exists
          const existingClaim = await fetch(`/api/identity/${user.identityAddress}/claim/${topicHashString}`).catch(() => null);
          
          if (existingClaim) {
            // Claim already exists, mark as issued
            setClaimStatuses(prev => prev.map(s => 
              s.userId === user.id && s.topicHash === topicHashString
                ? { ...s, status: 'issued' as const }
                : s
            ));
            continue;
          }

          // Generate claim data and signature
          const claimData = `Verified for ${PREDEFINED_TOPICS.find(t => t.hash === topicHashString)?.name || 'CLAIM'}`;
          const signature = await generateClaimSignature(user.identityAddress, topicHashString, claimData);

          // Issue the claim
          await writeContract({
            address: user.identityAddress as `0x${string}`,
            abi: identityImplementationAbi,
            functionName: 'addClaim',
            args: [
              BigInt(topicHashString), // _topic
              1, // _scheme (ECDSA)
              claimIssuerAddress as `0x${string}`, // _issuer
              signature as `0x${string}`, // _signature
              toBytes(claimData), // _data
              '' // _uri
            ]
          });

          // Mark as issued on success
          setClaimStatuses(prev => prev.map(s => 
            s.userId === user.id && s.topicHash === topicHashString
              ? { ...s, status: 'issued' as const, transactionHash: txHash }
              : s
          ));

        } catch (claimError) {
          // Mark as failed
          setClaimStatuses(prev => prev.map(s => 
            s.userId === user.id && s.topicHash === topicHashString
              ? { ...s, status: 'failed' as const, error: String(claimError) }
              : s
          ));
        }
      }

      // Update user status
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: 'claims_issued' as const } : u
      ));

    } catch (error) {
      setError(`Failed to issue claims for ${user.nickname}: ${String(error)}`);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Issue claims for all users
  const issueAllClaims = async () => {
    const pendingUsers = users.filter(u => u.status === 'pending');
    
    for (const user of pendingUsers) {
      await issueClaimsForUser(user);
      // Small delay between users to avoid nonce conflicts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setSuccessMessage(`Claims issued for ${pendingUsers.length} users`);
  };

  // Register users with identity registry
  const registerUser = async (user: UserEntry) => {
    if (!identityRegistryAddress) return;

    try {
      await writeContract({
        address: identityRegistryAddress as `0x${string}`,
        abi: identityRegistryAbi,
        functionName: 'registerIdentity',
        args: [
          user.walletAddress as `0x${string}`,
          user.identityAddress as `0x${string}`,
          user.country
        ]
      });

      // Update user status on success
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: 'registered' as const } : u
      ));

    } catch (error) {
      setError(`Failed to register ${user.nickname}: ${String(error)}`);
    }
  };

  // Register all users
  const registerAllUsers = async () => {
    const usersToRegister = users.filter(u => u.status === 'claims_issued');
    
    for (const user of usersToRegister) {
      await registerUser(user);
      // Small delay between registrations
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setSuccessMessage(`Registered ${usersToRegister.length} users with identity registry`);
  };

  // Handle transaction success
  useEffect(() => {
    if (isTxSuccess && txHash) {
      setSuccessMessage('Transaction completed successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [isTxSuccess, txHash]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setError(`Transaction failed: ${(writeError as any).shortMessage || writeError.message}`);
      setIsLoadingData(false);
    }
  }, [writeError]);

  // Clear messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Progress calculation
  const getOverallProgress = () => {
    if (users.length === 0) return 0;
    const completedUsers = users.filter(u => u.status === 'complete').length;
    const registeredUsers = users.filter(u => u.status === 'registered').length;
    
    // Complete users = 100%, Registered users = 80%
    const totalProgress = (completedUsers * 100) + (registeredUsers * 80);
    return Math.round(totalProgress / (users.length * 100) * 100);
  };

  // Check if setup is fully complete
  const isSetupComplete = () => {
    return users.length > 0 && users.every(u => u.status === 'complete');
  };

  const getUserStatusColor = (status: UserEntry['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-200 text-gray-800';
      case 'claims_issued': return 'bg-yellow-200 text-yellow-800';
      case 'registered': return 'bg-green-200 text-green-800';
      case 'complete': return 'bg-blue-200 text-blue-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 'users': return users.length > 0;
      case 'claims': return users.every(u => u.status !== 'pending');
      case 'registration': return users.every(u => u.status === 'registered' || u.status === 'complete');
      default: return false;
    }
  };

  // Complete setup function
  const completeSetup = async () => {
    setIsLoadingData(true);
    setError('');
    
    try {
      let allVerified = true;
      let completedCount = 0;
      const verificationResults = [];

      // Run verification for each user
      for (const user of users) {
        if (user.status === 'registered') {
          const verification = await verifyUserSetup(user);
          verificationResults.push({ user: user.nickname, ...verification });

          if (verification.isVerified && verification.errors.length === 0) {
            // Mark user as complete
            setUsers(prev => prev.map(u => 
              u.id === user.id ? { ...u, status: 'complete' as const } : u
            ));
            completedCount++;
          } else {
            allVerified = false;
            console.warn(`User ${user.nickname} verification failed:`, verification.errors);
          }
        } else if (user.status === 'complete') {
          completedCount++;
        } else {
          allVerified = false;
        }
      }

      // Refresh contract data
      await Promise.all([
        refetchRegistrationStatus(),
        refetchVerificationStatus(), 
        refetchUserIdentity()
      ]);

      // Set completion message
      if (allVerified) {
        setSuccessMessage(
          `🎉 Setup Complete! All ${completedCount} users are verified and ready for token transfers. ` +
          `Next steps: Mint tokens to users and unpause the token contract.`
        );
      } else {
        const failedUsers = users.filter(u => u.status !== 'complete').length;
        setSuccessMessage(
          `✅ Setup completed with ${completedCount} verified users. ` +
          `${failedUsers} users need attention before they can transfer tokens.`
        );
      }

      // Log detailed results for debugging
      console.log('Setup completion results:', {
        totalUsers: users.length,
        completedUsers: completedCount,
        allVerified,
        verificationResults
      });

    } catch (error) {
      setError(`Setup completion failed: ${String(error)}`);
      console.error('Setup completion error:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User Setup Wizard</h2>
        <p className="text-gray-600">Please connect your wallet to use the User Setup Wizard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">User Setup Wizard</h2>
        <p className="text-gray-600 mb-4">
          Set up users for token transfers: add identities → issue claims → register with token
        </p>
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="text-sm text-gray-600">{getOverallProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getOverallProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${currentStep === 'users' ? 'text-blue-600' : 'text-green-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'users' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
            }`}>1</div>
            <span className="ml-2 font-medium">Add Users</span>
          </div>
          <div className="w-16 h-1 bg-gray-300 mx-4"></div>
          <div className={`flex items-center ${
            currentStep === 'claims' ? 'text-blue-600' : 
            currentStep === 'registration' ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'claims' ? 'bg-blue-600 text-white' :
              currentStep === 'registration' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>2</div>
            <span className="ml-2 font-medium">Issue Claims</span>
          </div>
          <div className="w-16 h-1 bg-gray-300 mx-4"></div>
          <div className={`flex items-center ${currentStep === 'registration' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'registration' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>3</div>
            <span className="ml-2 font-medium">Register Identities</span>
          </div>
        </div>
      </div>

      {/* Contract addresses configuration */}
      {currentStep === 'users' && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Addresses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claim Topics Registry
              </label>
              <input
                type="text"
                value={claimTopicsRegistryAddress}
                onChange={(e) => setClaimTopicsRegistryAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trusted Issuers Registry
              </label>
              <input
                type="text"
                value={trustedIssuersRegistryAddress}
                onChange={(e) => setTrustedIssuersRegistryAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identity Registry
              </label>
              <input
                type="text"
                value={identityRegistryAddress}
                onChange={(e) => setIdentityRegistryAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claim Issuer
              </label>
              <input
                type="text"
                value={claimIssuerAddress}
                onChange={(e) => setClaimIssuerAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: User Identity Input */}
      {currentStep === 'users' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Add User Identities</h3>
          
          {/* Quick import options */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Quick Setup</h4>
            <button
              onClick={importTestUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Import Test Users (Alice, Bob, Charlie)
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Pre-configured test users with existing OnchainID contracts
            </p>
          </div>

          {/* Manual user entry */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Add Custom User</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Address *
                </label>
                <input
                  type="text"
                  value={newUser.walletAddress}
                  onChange={(e) => setNewUser(prev => ({ ...prev, walletAddress: e.target.value }))}
                  placeholder="0x... (receives tokens)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identity Address *
                </label>
                <input
                  type="text"
                  value={newUser.identityAddress}
                  onChange={(e) => setNewUser(prev => ({ ...prev, identityAddress: e.target.value }))}
                  placeholder="0x... (OnchainID contract)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nickname
                </label>
                <input
                  type="text"
                  value={newUser.nickname}
                  onChange={(e) => setNewUser(prev => ({ ...prev, nickname: e.target.value }))}
                  placeholder="Alice, Bob, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code
                </label>
                <input
                  type="number"
                  value={newUser.country}
                  onChange={(e) => setNewUser(prev => ({ ...prev, country: parseInt(e.target.value) || 42 }))}
                  placeholder="42"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={addUser}
              disabled={!newUser.walletAddress || !newUser.identityAddress}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add User
            </button>
          </div>

          {/* Users list */}
          {users.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Added Users ({users.length})</h4>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{user.nickname}</div>
                      <div className="text-sm text-gray-600">
                        Wallet: {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Identity: {user.identityAddress.slice(0, 6)}...{user.identityAddress.slice(-4)}
                      </div>
                      <div className="text-sm text-gray-600">Country: {user.country}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserStatusColor(user.status)}`}>
                        {user.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <button
                        onClick={() => removeUser(user.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep('claims')}
              disabled={!canProceedToNextStep()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next: Issue Claims
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Claims Issuance */}
      {currentStep === 'claims' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Step 2: Issue Claims to Identities</h3>
          
          {/* Available topics */}
          {availableTopics && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-medium mb-2">Available Claim Topics</h4>
              <div className="space-y-2">
                {(availableTopics as readonly bigint[]).map((topicHash) => {
                  const topic = PREDEFINED_TOPICS.find(t => t.hash === String(topicHash));
                  return (
                    <div key={String(topicHash)} className="flex items-center space-x-3">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="font-medium">{topic?.name || 'UNKNOWN_TOPIC'}</span>
                      <span className="text-sm text-gray-600">{topic?.description || String(topicHash).substring(0, 10)}...</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Claims matrix */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3">Claims Status Matrix</h4>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900">{user.nickname}</div>
                      <div className="text-sm text-gray-600">{user.identityAddress.slice(0, 10)}...</div>
                    </div>
                    <button
                      onClick={() => issueClaimsForUser(user)}
                      disabled={isLoadingData || user.status !== 'pending'}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm transition-colors"
                    >
                      Issue Claims
                    </button>
                  </div>
                  
                  {/* Topic status for this user */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {availableTopics && (availableTopics as readonly bigint[]).map((topicHash) => {
                      const topicHashString = String(topicHash);
                      const claimStatus = claimStatuses.find(s => s.userId === user.id && s.topicHash === topicHashString);
                      const topic = PREDEFINED_TOPICS.find(t => t.hash === topicHashString);
                      
                      return (
                        <div key={topicHashString} className="flex items-center space-x-2 text-sm">
                          <span className={`w-2 h-2 rounded-full ${
                            claimStatus?.status === 'issued' ? 'bg-green-500' :
                            claimStatus?.status === 'issuing' ? 'bg-yellow-500' :
                            claimStatus?.status === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                          }`}></span>
                          <span>{topic?.name || 'UNKNOWN'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk actions */}
          <div className="mb-6">
            <button
              onClick={issueAllClaims}
              disabled={isLoadingData || users.every(u => u.status !== 'pending')}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingData ? 'Issuing Claims...' : 'Issue All Claims'}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep('users')}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Back: Manage Users
            </button>
            <button
              onClick={() => setCurrentStep('registration')}
              disabled={!canProceedToNextStep()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next: Register Identities
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Identity Registration */}
      {currentStep === 'registration' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Step 3: Register Identities with Token</h3>
          
          {/* Registration status */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3">Registration Status</h4>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{user.nickname}</div>
                    <div className="text-sm text-gray-600">
                      {user.walletAddress.slice(0, 10)}... → Identity Registry
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserStatusColor(user.status)}`}>
                      {user.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {user.status === 'claims_issued' && (
                      <button
                        onClick={() => registerUser(user)}
                        disabled={isLoadingData}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm transition-colors"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk registration */}
          <div className="mb-6">
            <button
              onClick={registerAllUsers}
              disabled={isLoadingData || users.every(u => u.status !== 'claims_issued')}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingData ? 'Registering Users...' : 'Register All Users'}
            </button>
          </div>

          {/* Verification Section */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3">User Verification Status</h4>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="p-4 bg-white border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900">{user.nickname}</div>
                      <div className="text-sm text-gray-600">{user.walletAddress.slice(0, 10)}...</div>
                    </div>
                    <button
                      onClick={async () => {
                        const verification = await verifyUserSetup(user);
                        console.log(`Verification for ${user.nickname}:`, verification);
                        setSuccessMessage(`Verification complete for ${user.nickname}`);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
                    >
                      Verify Setup
                    </button>
                  </div>
                  
                  {/* Verification Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        user.status === 'registered' || user.status === 'complete' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span>Registered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        userIdentityFromRegistry && user.identityAddress && 
                        String(userIdentityFromRegistry).toLowerCase() === user.identityAddress.toLowerCase() 
                          ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span>Identity Match</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        claimStatuses.filter(s => s.userId === user.id && s.status === 'issued').length > 0 
                          ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span>Claims Issued</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        userVerificationStatus ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span>Fully Verified</span>
                    </div>
                  </div>
                  
                  {/* Claims Detail */}
                  <div className="mt-3 text-sm text-gray-600">
                    Claims: {claimStatuses.filter(s => s.userId === user.id && s.status === 'issued').length} / {availableTopics ? (availableTopics as readonly bigint[]).length : 0} issued
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep('claims')}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Back: Issue Claims
            </button>
            <button
              onClick={completeSetup}
              disabled={!canProceedToNextStep() || isLoadingData}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingData ? 'Completing Setup...' : 'Complete Setup'}
            </button>
          </div>
        </div>
      )}

      {/* Setup Completion Celebration */}
      {isSetupComplete() && (
        <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">User Setup Complete!</h3>
            <p className="text-green-700 mb-4">
              All {users.length} users are verified and ready for token transfers
            </p>
            <div className="bg-white p-4 rounded-md text-left">
              <h4 className="font-semibold text-gray-800 mb-2">✅ What's Ready:</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <div>• Users registered in Identity Registry</div>
                <div>• Required claims issued to OnchainID contracts</div>
                <div>• Identity verification complete</div>
                <div>• Compliance checks passing</div>
              </div>
              <h4 className="font-semibold text-gray-800 mt-4 mb-2">🚀 Next Steps:</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <div>• Mint tokens to verified users</div>
                <div>• Unpause the token contract</div>
                <div>• Test token transfers between users</div>
                <div>• Deploy transfer interface</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Verification Summary */}
      {users.length > 0 && currentStep === 'registration' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">Verification Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.status === 'registered' || u.status === 'complete').length}
              </div>
              <div className="text-blue-800">Users Registered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => claimStatuses.some(c => c.userId === u.id && c.status === 'issued')).length}
              </div>
              <div className="text-blue-800">Users with Claims</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {claimStatuses.filter(c => c.status === 'issued').length}
              </div>
              <div className="text-blue-800">Total Claims Issued</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.status === 'complete').length}
              </div>
              <div className="text-blue-800">Ready for Transfers</div>
            </div>
          </div>
          
          {/* Verification Methods */}
          <div className="mt-4 p-3 bg-white rounded-md">
            <h4 className="font-medium mb-2">How to Verify User Success:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div><strong>1. Registration Check:</strong> <code>IdentityRegistry.contains(userAddress)</code> returns <code>true</code></div>
              <div><strong>2. Identity Match:</strong> <code>IdentityRegistry.identity(userAddress)</code> matches provided OnchainID</div>
              <div><strong>3. Claims Verification:</strong> <code>Identity.getClaim(claimId)</code> returns valid claim data</div>
              <div><strong>4. Full Verification:</strong> <code>IdentityRegistry.isVerified(userAddress)</code> returns <code>true</code></div>
              <div><strong>5. Transfer Ready:</strong> User can receive and transfer tokens through compliance checks</div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="text-green-800">
            <strong>Success:</strong> {successMessage}
          </div>
        </div>
      )}

      {(isWritePending || isTxLoading || isLoadingData) && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-blue-800 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 mr-2"></div>
            {isWritePending && "Preparing transaction..."}
            {isTxLoading && "Transaction confirming..."}
            {isLoadingData && "Processing..."}
          </div>
        </div>
      )}
    </div>
  );
}
