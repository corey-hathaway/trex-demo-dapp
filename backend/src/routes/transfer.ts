import { Router } from 'express';
import { TransferRequest, TransactionResponse } from '../shared/types';
import { ApiEndpointResponse } from '../types/api';
import { logger } from '../utils/logger';
import { contractsService } from '../services/contracts';

export const transferRouter = Router();

/**
 * POST /api/transfer
 * Transfer tokens between addresses
 */
transferRouter.post('/', async (req, res) => {
  try {
    const { tokenAddress, from, to, amount }: TransferRequest = req.body;

    // Validate request
    if (!tokenAddress || !from || !to || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tokenAddress, from, to, amount',
        timestamp: new Date().toISOString()
      } as ApiEndpointResponse);
    }

    // Validate address formats
    const addresses = [tokenAddress, from, to];
    for (const addr of addresses) {
      if (!addr.startsWith('0x') || addr.length !== 42) {
        return res.status(400).json({
          success: false,
          error: `Invalid address format: ${addr}`,
          timestamp: new Date().toISOString()
        } as ApiEndpointResponse);
      }
    }

    logger.info(`Transferring tokens`, { tokenAddress, from, to, amount });

    // Execute transfer transaction
    const result = await contractsService.transferTokens(tokenAddress, from, to, amount);

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
    logger.error('Transfer endpoint error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to transfer tokens';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    } as ApiEndpointResponse);
  }
});
