import fs from 'fs';
import path from 'path';
import { CONTRACT_NAMES, ARTIFACT_PATHS } from '../shared/constants';
import { logger } from './logger';

interface ContractArtifact {
  abi: any[];
  bytecode: string;
  contractName: string;
  sourceName?: string;
}

class ArtifactsLoader {
  private artifactCache = new Map<string, ContractArtifact>();

  /**
   * Load contract artifact from T-REX artifacts directory
   */
  private loadArtifactFromPath(artifactPath: string): ContractArtifact {
    try {
      const fullPath = path.resolve(__dirname, artifactPath);
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Artifact file not found: ${fullPath}`);
      }

      const artifact = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      
      if (!artifact.abi || !artifact.bytecode) {
        throw new Error(`Invalid artifact format: ${fullPath}`);
      }

      return {
        abi: artifact.abi,
        bytecode: artifact.bytecode,
        contractName: artifact.contractName || path.basename(artifactPath, '.json'),
        sourceName: artifact.sourceName
      };

    } catch (error) {
      logger.error(`Failed to load artifact from ${artifactPath}:`, error);
      throw error;
    }
  }

  /**
   * Get contract artifact by name
   */
  getArtifact(contractName: string): ContractArtifact {
    // Check cache first
    if (this.artifactCache.has(contractName)) {
      return this.artifactCache.get(contractName)!;
    }

    let artifactPath: string;

    // Map contract names to their artifact paths
    switch (contractName) {
      // Implementation Authorities
      case CONTRACT_NAMES.IDENTITY_IMPLEMENTATION_AUTHORITY:
        artifactPath = `${ARTIFACT_PATHS.ONCHAIN_ID_PROXY}/ImplementationAuthority.sol/ImplementationAuthority.json`;
        break;
      case CONTRACT_NAMES.TREX_IMPLEMENTATION_AUTHORITY:
        artifactPath = `${ARTIFACT_PATHS.BASE}/TREXImplementationAuthority.sol/TREXImplementationAuthority.json`;
        break;

      // Implementations
      case CONTRACT_NAMES.IDENTITY_IMPLEMENTATION:
        artifactPath = `${ARTIFACT_PATHS.IMPLEMENTATIONS}/Identity.sol/Identity.json`;
        break;
      case CONTRACT_NAMES.CLAIM_TOPICS_IMPLEMENTATION:
        artifactPath = `${ARTIFACT_PATHS.BASE}/registry/implementation/ClaimTopicsRegistry.sol/ClaimTopicsRegistry.json`;
        break;
      case CONTRACT_NAMES.TRUSTED_ISSUERS_IMPLEMENTATION:
        artifactPath = `${ARTIFACT_PATHS.BASE}/registry/TrustedIssuersRegistry.sol/TrustedIssuersRegistry.json`;
        break;
      case CONTRACT_NAMES.IDENTITY_STORAGE_IMPLEMENTATION:
        artifactPath = `${ARTIFACT_PATHS.BASE}/registry/IdentityRegistryStorage.sol/IdentityRegistryStorage.json`;
        break;
      case CONTRACT_NAMES.IDENTITY_REGISTRY_IMPLEMENTATION:
        artifactPath = `${ARTIFACT_PATHS.BASE}/registry/IdentityRegistry.sol/IdentityRegistry.json`;
        break;
      case CONTRACT_NAMES.COMPLIANCE_IMPLEMENTATION:
        artifactPath = `${ARTIFACT_PATHS.BASE}/compliance/modular/ModularCompliance.sol/ModularCompliance.json`;
        break;
      case CONTRACT_NAMES.TOKEN_IMPLEMENTATION:
        artifactPath = `${ARTIFACT_PATHS.BASE}/token/Token.sol/Token.json`;
        break;

      // Factories
      case CONTRACT_NAMES.TREX_FACTORY:
        artifactPath = `${ARTIFACT_PATHS.BASE}/factory/TREXFactory.sol/TREXFactory.json`;
        break;
      case CONTRACT_NAMES.IDENTITY_FACTORY:
        artifactPath = `${ARTIFACT_PATHS.IMPLEMENTATIONS}/factory/IdFactory.sol/IdFactory.json`;
        break;

      // Proxies
      case CONTRACT_NAMES.TRUSTED_ISSUERS_REGISTRY:
        artifactPath = `${ARTIFACT_PATHS.PROXY}/TrustedIssuersRegistryProxy.sol/TrustedIssuersRegistryProxy.json`;
        break;
      case CONTRACT_NAMES.CLAIM_TOPICS_REGISTRY:
        artifactPath = `${ARTIFACT_PATHS.PROXY}/ClaimTopicsRegistryProxy.sol/ClaimTopicsRegistryProxy.json`;
        break;
      case CONTRACT_NAMES.IDENTITY_STORAGE:
        artifactPath = `${ARTIFACT_PATHS.PROXY}/IdentityRegistryStorageProxy.sol/IdentityRegistryStorageProxy.json`;
        break;
      case CONTRACT_NAMES.IDENTITY_REGISTRY:
        artifactPath = `${ARTIFACT_PATHS.PROXY}/IdentityRegistryProxy.sol/IdentityRegistryProxy.json`;
        break;
      case CONTRACT_NAMES.TOKEN:
        artifactPath = `${ARTIFACT_PATHS.PROXY}/TokenProxy.sol/TokenProxy.json`;
        break;

      // Other contracts
      case CONTRACT_NAMES.COMPLIANCE:
        artifactPath = `${ARTIFACT_PATHS.COMPLIANCE}/DefaultCompliance.sol/DefaultCompliance.json`;
        break;
      case CONTRACT_NAMES.TOKEN_OID:
        artifactPath = `${ARTIFACT_PATHS.BASE}/IdFactoryMock.sol/IdFactoryMock.json`;
        break;
      case CONTRACT_NAMES.AGENT_MANAGER:
        artifactPath = `${ARTIFACT_PATHS.BASE}/roles/permissioning/agent/AgentManager.sol/AgentManager.json`;
        break;

      default:
        throw new Error(`Unknown contract: ${contractName}`);
    }

    // Load and cache the artifact
    const artifact = this.loadArtifactFromPath(artifactPath);
    this.artifactCache.set(contractName, artifact);

    logger.debug(`Loaded artifact for ${contractName}`, {
      abiLength: artifact.abi.length,
      bytecodeLength: artifact.bytecode.length
    });

    return artifact;
  }

  /**
   * Get contract ABI by name
   */
  getAbi(contractName: string): any[] {
    return this.getArtifact(contractName).abi;
  }

  /**
   * Get contract bytecode by name
   */
  getBytecode(contractName: string): string {
    return this.getArtifact(contractName).bytecode;
  }

  /**
   * Preload commonly used artifacts
   */
  preloadArtifacts() {
    const commonContracts = [
      CONTRACT_NAMES.IDENTITY_IMPLEMENTATION_AUTHORITY,
      CONTRACT_NAMES.IDENTITY_IMPLEMENTATION,
      CONTRACT_NAMES.TREX_IMPLEMENTATION_AUTHORITY,
      CONTRACT_NAMES.TREX_FACTORY,
      CONTRACT_NAMES.IDENTITY_FACTORY,
      CONTRACT_NAMES.TOKEN,
      CONTRACT_NAMES.AGENT_MANAGER
    ];

    logger.info('Preloading common contract artifacts...');
    
    for (const contractName of commonContracts) {
      try {
        this.getArtifact(contractName);
      } catch (error) {
        logger.warn(`Failed to preload ${contractName}:`, error);
      }
    }
    
    logger.info(`Preloaded ${this.artifactCache.size} contract artifacts`);
  }
}

// Export singleton instance
export const artifactsLoader = new ArtifactsLoader();
