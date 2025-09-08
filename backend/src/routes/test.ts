import { Router } from 'express';
import { blockchainService } from '../services/blockchain';
import { polkadotDeploymentService } from '../services/polkadot-deployment';
import { artifactsLoader } from '../utils/artifacts';
import { CONTRACT_NAMES } from '../shared/constants';
import { logger } from '../utils/logger';

export const testRouter = Router();

/**
 * POST /api/test/simple-deploy
 * Test deploying a single simple contract
 */
testRouter.post('/simple-deploy', async (req, res) => {
  try {
    logger.info('Testing simple contract deployment');
    
    // Try to deploy the simplest contract first - ClaimTopicsRegistry
    const artifact = artifactsLoader.getArtifact(CONTRACT_NAMES.CLAIM_TOPICS_IMPLEMENTATION);
    
    logger.info('Artifact loaded', { 
      contractName: CONTRACT_NAMES.CLAIM_TOPICS_IMPLEMENTATION,
      bytecodeLength: artifact.bytecode.length,
      abiLength: artifact.abi.length
    });

    // Test full hybrid deployment: PVM upload + Ethereum deployment (matching main deployment flow)
    // NOTE: Currently fails with "Invalid Transaction" due to large PVM bytecode size limits in Ethereum layer
    // This is a known limitation affecting both our implementation and T-REX's approach
    // The PVM upload step succeeds, but Ethereum deployment fails for large contracts (15KB+)
    const result = await polkadotDeploymentService.deployContract(
      CONTRACT_NAMES.CLAIM_TOPICS_IMPLEMENTATION,
      artifact.bytecode,
      artifact.abi,
      [] // No constructor args for ClaimTopicsRegistry
    );

    res.json({
      success: true,
      data: {
        address: result.address,
        codeHash: result.codeHash,
        transactionHash: result.transactionHash,
        message: 'Contract deployed via hybrid approach (PVM upload + Ethereum deployment)'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('Simple deployment test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/test/health
 * Test blockchain connection
 */
testRouter.get('/health', async (req, res) => {
  try {
    const health = await blockchainService.checkHealth();
    res.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
