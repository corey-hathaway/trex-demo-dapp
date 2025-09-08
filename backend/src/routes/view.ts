import { Router } from 'express';
import { TokenInfo, BalanceInfo } from '../shared/types';
import { ApiEndpointResponse } from '../types/api';
import { logger } from '../utils/logger';
import { contractsService } from '../services/contracts';

export const viewRouter = Router();

/**
 * GET /api/view/token/:address
 * Get token information
 */
viewRouter.get('/token/:address', async (req, res) => {
  try {
    const { address } = req.params;

    // Validate address format
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token address format',
        timestamp: new Date().toISOString()
      } as ApiEndpointResponse);
    }

    logger.debug(`Getting token info for ${address}`);

    // Get token information
    const tokenInfo = await contractsService.getTokenInfo(address);

    res.json({
      success: true,
      data: tokenInfo,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse<TokenInfo>);

  } catch (error) {
    logger.error('View token endpoint error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to get token information';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);
  }
});

/**
 * GET /api/view/balance/:tokenAddress/:userAddress
 * Get user balance for a specific token
 */
viewRouter.get('/balance/:tokenAddress/:userAddress', async (req, res) => {
  try {
    const { tokenAddress, userAddress } = req.params;

    // Validate address formats
    const addresses = [tokenAddress, userAddress];
    for (const addr of addresses) {
      if (!addr || !addr.startsWith('0x') || addr.length !== 42) {
        return res.status(400).json({
          success: false,
          error: `Invalid address format: ${addr}`,
          timestamp: new Date().toISOString()
        } as ApiEndpointResponse);
      }
    }

    logger.debug(`Getting balance for ${userAddress} on token ${tokenAddress}`);

    // Get balance information
    const balanceInfo = await contractsService.getBalanceInfo(tokenAddress, userAddress);

    res.json({
      success: true,
      data: balanceInfo,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse<BalanceInfo>);

  } catch (error) {
    logger.error('View balance endpoint error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to get balance information';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);
  }
});

/**
 * GET /api/view/health
 * Health check for blockchain connection
 */
viewRouter.get('/health', async (req, res) => {
  try {
    const health = await contractsService.checkHealth();

    res.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);

  } catch (error) {
    logger.error('Health check endpoint error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Blockchain connection unhealthy',
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);
  }
});
