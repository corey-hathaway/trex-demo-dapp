import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { DeploymentRequest, DeployedContracts, DEPLOYMENT_STEPS } from '../shared/types';
import { CONTRACT_NAMES, POLKADOT_CONFIG } from '../shared/constants';
import { blockchainService } from './blockchain';
import { polkadotDeploymentService } from './polkadot-deployment';
import { artifactsLoader } from '../utils/artifacts';
import { logger } from '../utils/logger';

const DEPOSIT_LIMIT = BigInt('340282366920938463463374607431768211455');

interface DeploymentResult {
  contracts: DeployedContracts;
  transactionHashes: string[];
}

class DeploymentService {
  constructor() {
    // No longer need Polkadot API initialization here - using polkadotDeploymentService
  }

  /**
   * Deploy identity proxy (OnchainID)
   */
  private async deployIdentityProxy(implementationAuthority: string, managementKey: string): Promise<{ address: string; transactionHash: string }> {
    // Get OnchainID IdentityProxy artifact - we'll need to handle this separately
    // For now, let's use a simplified approach
    const abi = []; // TODO: Load from OnchainID artifacts
    const bytecode = '0x'; // TODO: Load from OnchainID artifacts

    return await blockchainService.deployContract(bytecode, abi, [implementationAuthority, managementKey]);
  }

  /**
   * Start the full T-REX deployment process
   */
  async startDeployment(deploymentId: string, request: DeploymentRequest): Promise<DeploymentResult> {
    logger.info(`Starting T-REX deployment ${deploymentId}`, request);

    const contracts: Partial<DeployedContracts> = {};
    const transactionHashes: string[] = [];
    let currentStep = 0;

    try {
      // Step 1: Deploy Identity Implementation Authority
      logger.info(`Step ${++currentStep}: Deploying Identity Implementation Authority`);
      const identityImplArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.IDENTITY_IMPLEMENTATION_AUTHORITY);
      
      // Deploy Identity Implementation first (needed for authority constructor)
      logger.info(`Step ${++currentStep}: Deploying Identity Implementation`);
      const identityArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.IDENTITY_IMPLEMENTATION);
      
      const serviceAccount = blockchainService.getServiceAccount();
      const identityImpl = await polkadotDeploymentService.deployContract(
        'IdentityImplementation',
        identityArtifact.bytecode,
        identityArtifact.abi,
        [serviceAccount, true]
      );
      contracts.identityImplementation = identityImpl.address;
      transactionHashes.push(identityImpl.transactionHash);

      // Now deploy Identity Implementation Authority
      const identityImplAuth = await polkadotDeploymentService.deployContract(
        'IdentityImplementationAuthority',
        identityImplArtifact.bytecode,
        identityImplArtifact.abi,
        [identityImpl.address]
      );
      contracts.identityImplementationAuthority = identityImplAuth.address;
      transactionHashes.push(identityImplAuth.transactionHash);

      // Step 3: Deploy Identity Factory
      logger.info(`Step ${++currentStep}: Deploying Identity Factory`);
      const identityFactoryArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.IDENTITY_FACTORY);
      
      const identityFactory = await polkadotDeploymentService.deployContract(
        'IdentityFactory',
        identityFactoryArtifact.bytecode,
        identityFactoryArtifact.abi,
        [identityImplAuth.address]
      );
      contracts.identityFactory = identityFactory.address;
      transactionHashes.push(identityFactory.transactionHash);

      // Step 4: Deploy T-REX Implementation contracts
      logger.info(`Step ${++currentStep}: Deploying T-REX Implementation contracts`);
      
      const implementations = [
        { name: CONTRACT_NAMES.CLAIM_TOPICS_IMPLEMENTATION, key: 'claimTopicsImplementation' },
        { name: CONTRACT_NAMES.TRUSTED_ISSUERS_IMPLEMENTATION, key: 'trustedIssuersImplementation' },
        { name: CONTRACT_NAMES.IDENTITY_STORAGE_IMPLEMENTATION, key: 'identityStorageImplementation' },
        { name: CONTRACT_NAMES.IDENTITY_REGISTRY_IMPLEMENTATION, key: 'identityRegistryImplementation' },
        { name: CONTRACT_NAMES.COMPLIANCE_IMPLEMENTATION, key: 'complianceImplementation' },
        { name: CONTRACT_NAMES.TOKEN_IMPLEMENTATION, key: 'tokenImplementation' }
      ];

      for (const impl of implementations) {
        logger.info(`Deploying ${impl.name}`);
        const artifact = artifactsLoader.getArtifact(impl.name);
        
        const deployment = await polkadotDeploymentService.deployContract(
          impl.name,
          artifact.bytecode,
          artifact.abi,
          []
        );
        (contracts as any)[impl.key] = deployment.address;
        transactionHashes.push(deployment.transactionHash);
      }

      // Step 5: Deploy T-REX Implementation Authority
      logger.info(`Step ${++currentStep}: Deploying T-REX Implementation Authority`);
      const trexImplAuthArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.TREX_IMPLEMENTATION_AUTHORITY);
      
      const trexImplAuth = await polkadotDeploymentService.deployContract(
        'TREXImplementationAuthority',
        trexImplAuthArtifact.bytecode,
        trexImplAuthArtifact.abi,
        [true, '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000']
      );
      contracts.trexImplementationAuthority = trexImplAuth.address;
      transactionHashes.push(trexImplAuth.transactionHash);

      // Step 6: Add T-REX version to Implementation Authority
      logger.info(`Step ${++currentStep}: Adding T-REX version`);
      const versionStruct = { major: 4, minor: 0, patch: 0 };
      const contractsStruct = {
        tokenImplementation: contracts.tokenImplementation,
        ctrImplementation: contracts.claimTopicsImplementation,
        irImplementation: contracts.identityRegistryImplementation,
        irsImplementation: contracts.identityStorageImplementation,
        tirImplementation: contracts.trustedIssuersImplementation,
        mcImplementation: contracts.complianceImplementation,
      };
      
      const addVersionHash = await blockchainService.writeContract(
        trexImplAuth.address,
        trexImplAuthArtifact.abi,
        'addAndUseTREXVersion',
        [versionStruct, contractsStruct]
      );
      transactionHashes.push(addVersionHash);
      await blockchainService.waitForTransaction(addVersionHash);

      // Step 7: Deploy T-REX Factory
      logger.info(`Step ${++currentStep}: Deploying T-REX Factory`);
      const trexFactoryArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.TREX_FACTORY);
      
      const trexFactory = await polkadotDeploymentService.deployContract(
        'TREXFactory',
        trexFactoryArtifact.bytecode,
        trexFactoryArtifact.abi,
        [trexImplAuth.address, identityFactory.address]
      );
      contracts.trexFactory = trexFactory.address;
      transactionHashes.push(trexFactory.transactionHash);

      // Step 8: Link factories
      logger.info(`Step ${++currentStep}: Linking factories`);
      const linkHash = await blockchainService.writeContract(
        identityFactory.address,
        identityFactoryArtifact.abi,
        'addTokenFactory',
        [trexFactory.address]
      );
      transactionHashes.push(linkHash);
      await blockchainService.waitForTransaction(linkHash);

      // Step 9: Deploy registry proxy contracts
      logger.info(`Step ${++currentStep}: Deploying registry proxies`);
      
      // Claim Topics Registry
      const claimTopicsArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.CLAIM_TOPICS_REGISTRY);
      const claimTopics = await polkadotDeploymentService.deployContract(
        'ClaimTopicsRegistryProxy',
        claimTopicsArtifact.bytecode,
        claimTopicsArtifact.abi,
        [trexImplAuth.address]
      );
      contracts.claimTopicsRegistry = claimTopics.address;
      transactionHashes.push(claimTopics.transactionHash);

      // Trusted Issuers Registry
      const trustedIssuersArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.TRUSTED_ISSUERS_REGISTRY);
      const trustedIssuers = await polkadotDeploymentService.deployContract(
        'TrustedIssuersRegistryProxy',
        trustedIssuersArtifact.bytecode,
        trustedIssuersArtifact.abi,
        [trexImplAuth.address]
      );
      contracts.trustedIssuersRegistry = trustedIssuers.address;
      transactionHashes.push(trustedIssuers.transactionHash);

      // Identity Storage
      const identityStorageArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.IDENTITY_STORAGE);
      const identityStorage = await polkadotDeploymentService.deployContract(
        'IdentityRegistryStorageProxy',
        identityStorageArtifact.bytecode,
        identityStorageArtifact.abi,
        [trexImplAuth.address]
      );
      contracts.identityStorage = identityStorage.address;
      transactionHashes.push(identityStorage.transactionHash);

      // Step 10: Deploy Default Compliance
      logger.info(`Step ${++currentStep}: Deploying Default Compliance`);
      const complianceArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.COMPLIANCE);
      const compliance = await polkadotDeploymentService.deployContract(
        'DefaultCompliance',
        complianceArtifact.bytecode,
        complianceArtifact.abi,
        []
      );
      contracts.compliance = compliance.address;
      transactionHashes.push(compliance.transactionHash);

      // Step 11: Deploy Identity Registry
      logger.info(`Step ${++currentStep}: Deploying Identity Registry`);
      const identityRegistryArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.IDENTITY_REGISTRY);
      const identityRegistry = await polkadotDeploymentService.deployContract(
        'IdentityRegistryProxy',
        identityRegistryArtifact.bytecode,
        identityRegistryArtifact.abi,
        [trexImplAuth.address, trustedIssuers.address, claimTopics.address, identityStorage.address]
      );
      contracts.identityRegistry = identityRegistry.address;
      transactionHashes.push(identityRegistry.transactionHash);

      // Step 12: Deploy Token OnchainID
      logger.info(`Step ${++currentStep}: Deploying Token OnchainID`);
      // For now, using a mock implementation
      const tokenOIDArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.TOKEN_OID);
      const tokenOID = await polkadotDeploymentService.deployContract(
        'TokenOID',
        tokenOIDArtifact.bytecode,
        tokenOIDArtifact.abi,
        []
      );
      contracts.tokenOID = tokenOID.address;
      transactionHashes.push(tokenOID.transactionHash);

      // Step 13: Deploy Token
      logger.info(`Step ${++currentStep}: Deploying Token`);
      const tokenArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.TOKEN);
      const token = await polkadotDeploymentService.deployContract(
        'TokenProxy',
        tokenArtifact.bytecode,
        tokenArtifact.abi,
        [
          trexImplAuth.address,
          identityRegistry.address,
          compliance.address,
          request.tokenName,
          request.tokenSymbol,
          request.decimals,
          tokenOID.address
        ]
      );
      contracts.token = token.address;
      transactionHashes.push(token.transactionHash);

      // Step 14: Deploy Agent Manager (Optional)
      logger.info(`Step ${++currentStep}: Deploying Agent Manager`);
      try {
        const agentManagerArtifact = artifactsLoader.getArtifact(CONTRACT_NAMES.AGENT_MANAGER);
        const agentManager = await polkadotDeploymentService.deployContract(
          'AgentManager',
          agentManagerArtifact.bytecode,
          agentManagerArtifact.abi,
          [token.address]
        );
        contracts.agentManager = agentManager.address;
        transactionHashes.push(agentManager.transactionHash);
      } catch (error) {
        logger.warn('Agent Manager deployment failed (optional):', error);
      }

      // Step 15: Set up registry bindings
      logger.info(`Step ${++currentStep}: Setting up registry bindings`);
      const bindHash = await blockchainService.writeContract(
        identityStorage.address,
        identityStorageArtifact.abi,
        'bindIdentityRegistry',
        [identityRegistry.address]
      );
      transactionHashes.push(bindHash);
      await blockchainService.waitForTransaction(bindHash);

      const addAgentHash = await blockchainService.writeContract(
        token.address,
        tokenArtifact.abi,
        'addAgent',
        [blockchainService.getServiceAccount()]
      );
      transactionHashes.push(addAgentHash);
      await blockchainService.waitForTransaction(addAgentHash);

      logger.info(`T-REX deployment ${deploymentId} completed successfully`);

      return {
        contracts: contracts as DeployedContracts,
        transactionHashes
      };

    } catch (error) {
      logger.error(`T-REX deployment ${deploymentId} failed at step ${currentStep}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const deploymentService = new DeploymentService();
