import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DeploymentRequest, DeploymentResponse } from '../shared/types';
import { ApiEndpointResponse, DeploymentJob } from '../types/api';
import { logger } from '../utils/logger';
import { deploymentService } from '../services/deployment';

export const deployRouter = Router();

// In-memory storage for deployment jobs (in production, use Redis or database)
const deploymentJobs = new Map<string, DeploymentJob>();

/**
 * POST /api/deploy
 * Start a new T-REX token deployment
 */
deployRouter.post('/', async (req, res) => {
  try {
    const { tokenName, tokenSymbol, decimals }: DeploymentRequest = req.body;

    // Validate request
    if (!tokenName || !tokenSymbol || typeof decimals !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tokenName, tokenSymbol, decimals',
        timestamp: new Date().toISOString()
      } as ApiEndpointResponse);
    }

    // Create deployment job
    const deploymentId = uuidv4();
    const job: DeploymentJob = {
      id: deploymentId,
      status: 'pending',
      request: { tokenName, tokenSymbol, decimals },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    deploymentJobs.set(deploymentId, job);

    logger.info(`Starting deployment ${deploymentId}`, { tokenName, tokenSymbol, decimals });

    // Start deployment asynchronously
    deploymentService.startDeployment(deploymentId, { tokenName, tokenSymbol, decimals })
      .then((result) => {
        const job = deploymentJobs.get(deploymentId);
        if (job) {
          job.status = 'complete';
          job.result = result;
          job.updatedAt = new Date();
          deploymentJobs.set(deploymentId, job);
        }
        logger.info(`Deployment ${deploymentId} completed successfully`);
      })
      .catch((error) => {
        const job = deploymentJobs.get(deploymentId);
        if (job) {
          job.status = 'error';
          job.error = error.message;
          job.updatedAt = new Date();
          deploymentJobs.set(deploymentId, job);
        }
        logger.error(`Deployment ${deploymentId} failed`, error);
      });

    // Return immediately with deployment ID
    const response: DeploymentResponse = {
      deploymentId,
      status: 'pending'
    };

    res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse<DeploymentResponse>);

  } catch (error) {
    logger.error('Deploy endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start deployment',
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);
  }
});

/**
 * GET /api/deploy/status/:deploymentId
 * Get deployment status and progress
 */
deployRouter.get('/status/:deploymentId', (req, res) => {
  try {
    const { deploymentId } = req.params;
    const job = deploymentJobs.get(deploymentId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Deployment not found',
        timestamp: new Date().toISOString()
      } as ApiEndpointResponse);
    }

    const response: DeploymentResponse = {
      deploymentId: job.id,
      status: job.status,
      currentStep: job.currentStep,
      progress: job.progress,
      contracts: job.result?.contracts,
      error: job.error
    };

    res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse<DeploymentResponse>);

  } catch (error) {
    logger.error('Deploy status endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get deployment status',
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);
  }
});

/**
 * GET /api/deploy/list
 * List all deployments (for debugging)
 */
deployRouter.get('/list', (req, res) => {
  try {
    const jobs = Array.from(deploymentJobs.values()).map(job => ({
      id: job.id,
      status: job.status,
      tokenName: job.request.tokenName,
      tokenSymbol: job.request.tokenSymbol,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    }));

    res.json({
      success: true,
      data: jobs,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);

  } catch (error) {
    logger.error('Deploy list endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list deployments',
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);
  }
});
