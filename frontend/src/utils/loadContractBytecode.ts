export const loadTrustedIssuersProxyBytecode = async (): Promise<`0x${string}`> => {
  try {
    // Dynamic import of the artifact JSON file
    const artifact = await import('../../../T-REX/artifacts-pvm/contracts/proxy/TrustedIssuersRegistryProxy.sol/TrustedIssuersRegistryProxy.json');
    return artifact.bytecode as `0x${string}`;
  } catch (error) {
    console.error('Failed to load TrustedIssuersRegistryProxy bytecode:', error);
    throw new Error('Contract bytecode not found');
  }
};

// Generic loader for multiple contracts
export const loadContractBytecode = async (contractPath: string): Promise<`0x${string}`> => {
  try {
    const artifact = await import(`../../../T-REX/artifacts-pvm/${contractPath}`);
    return artifact.bytecode as `0x${string}`;
  } catch (error) {
    console.error(`Failed to load bytecode from ${contractPath}:`, error);
    throw new Error('Contract bytecode not found');
  }
};

// Predefined contract paths for easy access
export const CONTRACT_PATHS = {
  TRUSTED_ISSUERS_REGISTRY_PROXY: 'contracts/proxy/TrustedIssuersRegistryProxy.sol/TrustedIssuersRegistryProxy.json',
  CLAIM_TOPICS_REGISTRY_PROXY: 'contracts/proxy/ClaimTopicsRegistryProxy.sol/ClaimTopicsRegistryProxy.json',
  IDENTITY_REGISTRY_PROXY: 'contracts/proxy/IdentityRegistryProxy.sol/IdentityRegistryProxy.json',
  IDENTITY_REGISTRY_STORAGE_PROXY: 'contracts/proxy/IdentityRegistryStorageProxy.sol/IdentityRegistryStorageProxy.json',
  TOKEN_PROXY: 'contracts/proxy/TokenProxy.sol/TokenProxy.json',
  MODULAR_COMPLIANCE_PROXY: 'contracts/proxy/ModularComplianceProxy.sol/ModularComplianceProxy.json'
} as const;

// Convenience functions for specific contracts
export const loadClaimTopicsRegistryProxyBytecode = async (): Promise<`0x${string}`> => {
  return loadContractBytecode(CONTRACT_PATHS.CLAIM_TOPICS_REGISTRY_PROXY);
};

export const loadIdentityRegistryProxyBytecode = async (): Promise<`0x${string}`> => {
  return loadContractBytecode(CONTRACT_PATHS.IDENTITY_REGISTRY_PROXY);
};

export const loadTokenProxyBytecode = async (): Promise<`0x${string}`> => {
  return loadContractBytecode(CONTRACT_PATHS.TOKEN_PROXY);
};
