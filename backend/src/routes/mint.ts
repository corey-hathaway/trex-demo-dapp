import { Router } from 'express';
import { MintRequest, TransactionResponse } from '../shared/types';
import { ApiEndpointResponse } from '../types/api';
import { logger } from '../utils/logger';
import { contractsService } from '../services/contracts';

export const mintRouter = Router();

/**
 * POST /api/mint
 * Mint tokens to a specific address
 */
mintRouter.post('/', async (req, res) => {
  try {
    const { tokenAddress, to, amount }: MintRequest = req.body;

    // Validate request
    if (!tokenAddress || !to || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tokenAddress, to, amount',
        timestamp: new Date().toISOString()
      } as ApiEndpointResponse);
    }

    // Validate address format
    if (!tokenAddress.startsWith('0x') || tokenAddress.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token address format',
        timestamp: new Date().toISOString()
      } as ApiEndpointResponse);
    }

    if (!to.startsWith('0x') || to.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipient address format',
        timestamp: new Date().toISOString()
      } as ApiEndpointResponse);
    }

    logger.info(`Minting tokens`, { tokenAddress, to, amount });

    // Execute mint transaction
    const result = await contractsService.mintTokens(tokenAddress, to, amount);

    const response: TransactionResponse = {
      success: true,
      transactionHash: result.transactionHash
    };

    res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse<TransactionResponse>);

  } catch (error) {
    logger.error('Mint endpoint error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to mint tokens';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);
  }
});
