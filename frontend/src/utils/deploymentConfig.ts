interface DeploymentConfig {
  implementationAuthority: string;
  identityImplementationAuthority: string;
  idFactory: string;
  existingIRS?: string;
  claimIssuer?: string;
}

// Static deployment data imported directly (copied from T-REX/deployment/420420420.json)
const DEPLOYMENT_DATA = {
  420420420: {
    chainId: 420420420,
    network: "assetHub",
    deployer: "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac",
    factories: {
      trexFactory: "0xd528a533599223CA6B5EBdd1C32A241432FB1AE8",
      identityFactory: "0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963"
    },
    authorities: {
      trexImplementationAuthority: "0x867fb76BA206040EA09e73f38EdA307413d4966F",
      identityImplementationAuthority: "0x3469E1DaC06611030AEce8209F07501E9A7aCC69"
    },
    implementations: {
      identityImplementation: "0x21cb3940e6Ba5284E1750F1109131a8E8062b9f1",
      claimTopicsRegistryImplementation: "0xc01Ee7f10EA4aF4673cFff62710E1D7792aBa8f3",
      trustedIssuersRegistryImplementation: "0x970951a12F975E6762482ACA81E57D5A2A4e73F4",
      identityRegistryStorageImplementation: "0x3ed62137c5DB927cb137c26455969116BF0c23Cb",
      identityRegistryImplementation: "0x962c0940d72E7Db6c9a5F81f1cA87D8DB2B82A23",
      modularComplianceImplementation: "0x5CC307268a1393AB9A764A20DACE848AB8275c46",
      tokenImplementation: "0xeAB4eEBa1FF8504c124D031F6844AD98d07C318f"
    },
    suite: {
      token: "0xEC69d4f48f4f1740976968FAb9828d645Ad1d77f",
      identityRegistry: "0x294c664f6D63bd1521231a2EeFC26d805ce00a08",
      identityRegistryStorage: "0x598efcBD0B5b4Fd0142bEAae1a38f6Bd4d8a218d",
      trustedIssuersRegistry: "0xb6F2B9415fc599130084b7F20B84738aCBB15930",
      claimTopicsRegistry: "0x3649E46eCD6A0bd187f0046C4C35a7B31C92bA1E",
      defaultCompliance: "0x746DFE0F96789e62CECeeA3CA2a9b5556b3AaD6c",
      agentManager: "0x493275370aF3f63d9ccd10a6539435121cF4fbb9",
      tokenOID: "0x82745827D0B8972eC0583B3100eCb30b81Db0072",
      claimIssuerContract: "0xab7785d56697E65c2683c8121Aac93D3A028Ba95"
    },
    testWallets: {
      alice: {
        address: "0x3452D27d07C7004007ac986cD3Efa3Ac36677680",
        privateKey: "0x2dc1e0836b130bd35294bc49c88fad4ce008d6c9d14f9381879976907bbd6610",
        identity: "0x78D714e1b47Bb86FE15788B917C9CC7B77975529"
      },
      bob: {
        address: "0x234Ab1c08319e690b5B41652bf028C6Af85063c8",
        privateKey: "0xaba8288ce66fc00ef5ec9cf2e84e9b08c42ff59c01ff8ab70be59720f837f3c8",
        identity: "0x9Aaaf5ef347F1f1aF5377dB81500Db2Aa4c5a216"
      },
      charlie: {
        address: "0x1da264b338befffD424eF64734D5f7689274E82B",
        privateKey: "0x28f21dbdd429b495cda3e9c9005141de9ad106e5bd19b5d6841d8af4538766c6",
        identity: "0xF0e46847c8bFD122C4b5EEE1D4494FF7C5FC5104"
      }
    },
    tokenInfo: {
      name: "TREXDINO",
      symbol: "TREX",
      decimals: 0
    }
  }
} as const;

export const getDeploymentConfig = (chainId: number): DeploymentConfig => {
  const deploymentData = DEPLOYMENT_DATA[chainId as keyof typeof DEPLOYMENT_DATA];
  
  if (!deploymentData) {
    throw new Error(`No deployment configuration found for chain ${chainId}`);
  }
  
  return {
    implementationAuthority: deploymentData.authorities.trexImplementationAuthority,
    identityImplementationAuthority: deploymentData.authorities.identityImplementationAuthority,
    idFactory: deploymentData.factories.identityFactory,
    existingIRS: deploymentData.suite.identityRegistryStorage,
    claimIssuer: deploymentData.suite.claimIssuerContract
  };
};

// Convenience function to get just the implementation authority
export const getImplementationAuthority = (chainId: number): string => {
  const config = getDeploymentConfig(chainId);
  return config.implementationAuthority;
};

// Validate deployment configuration
export const validateDeploymentConfig = (config: DeploymentConfig): boolean => {
  return !!(
    config.implementationAuthority &&
    config.identityImplementationAuthority &&
    config.idFactory &&
    config.implementationAuthority !== '0x0000000000000000000000000000000000000000' &&
    config.identityImplementationAuthority !== '0x0000000000000000000000000000000000000000' &&
    config.idFactory !== '0x0000000000000000000000000000000000000000'
  );
};

// Get available chain IDs (based on existing deployment files)
export const getAvailableChains = (): number[] => {
  // For now, return known chain ID - could be made dynamic
  return [420420420]; // AssetHub chain ID
};

// Check if deployment config exists for chain
export const hasDeploymentConfig = (chainId: number): boolean => {
  try {
    getDeploymentConfig(chainId);
    return true;
  } catch {
    return false;
  }
};

// Export interface for use in components
export type { DeploymentConfig };
