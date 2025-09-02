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

export const loadClaimTopicsRegistryProxyBytecode = async (): Promise<`0x${string}`> => {
    try {
      // Dynamic import of the artifact JSON file
      const artifact = await import('../../../T-REX/artifacts-pvm/contracts/proxy/ClaimTopicsRegistryProxy.sol/ClaimTopicsRegistryProxy.json');
      return artifact.bytecode as `0x${string}`;
    } catch (error) {
      console.error('Failed to load ClaimTopicsRegistryProxy bytecode:', error);
      throw new Error('Contract bytecode not found');
    }
  };

  export const loadIdentityRegistryStorageProxyBytecode = async (): Promise<`0x${string}`> => {
    try {
      // Dynamic import of the artifact JSON file
      const artifact = await import('../../../T-REX/artifacts-pvm/contracts/proxy/IdentityRegistryStorageProxy.sol/IdentityRegistryStorageProxy.json');
      return artifact.bytecode as `0x${string}`;
    } catch (error) {
      console.error('Failed to load IdentityRegistryStorageProxy bytecode:', error);
      throw new Error('Contract bytecode not found');
    }
  };

  export const loadIdentityRegistryProxyBytecode = async (): Promise<`0x${string}`> => {
    try {
      // Dynamic import of the artifact JSON file
      const artifact = await import('../../../T-REX/artifacts-pvm/contracts/proxy/IdentityRegistryProxy.sol/IdentityRegistryProxy.json');
      return artifact.bytecode as `0x${string}`;
    } catch (error) {
      console.error('Failed to load IdentityRegistryProxy bytecode:', error);
      throw new Error('Contract bytecode not found');
    }
  };

  export const loadDefaultComplianceBytecode = async (): Promise<`0x${string}`> => {
    try {
      // Dynamic import of the artifact JSON file
      const artifact = await import('../../../T-REX/artifacts-pvm/contracts/compliance/legacy/DefaultCompliance.sol/DefaultCompliance.json');
      return artifact.bytecode as `0x${string}`;
    } catch (error) {
      console.error('Failed to load DefaultCompliance bytecode:', error);
      throw new Error('Contract bytecode not found');
    }
  };

  export const loadTokenProxyBytecode = async (): Promise<`0x${string}`> => {
    try {
      // Dynamic import of the artifact JSON file
      const artifact = await import('../../../T-REX/artifacts-pvm/contracts/proxy/TokenProxy.sol/TokenProxy.json');
      return artifact.bytecode as `0x${string}`;
    } catch (error) {
      console.error('Failed to load TokenProxy bytecode:', error);
      throw new Error('Contract bytecode not found');
    }
  };