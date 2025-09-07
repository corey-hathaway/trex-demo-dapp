import express from 'express';
import Joi from 'joi';
import { Token } from '../models/Token.js';
import { Transaction } from '../models/Transaction.js';

const router = express.Router();

// Validation schemas
const createTokenSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  symbol: Joi.string().min(1).max(10).required(),
  supply: Joi.string().pattern(/^\d+$/).required(),
  decimals: Joi.number().integer().min(0).max(18).default(0),
  owner_address: Joi.string().required()
});

const updateTokenSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  symbol: Joi.string().min(1).max(10),
  supply: Joi.string().pattern(/^\d+$/),
  decimals: Joi.number().integer().min(0).max(18),
  address: Joi.string(),
  status: Joi.string().valid('pending', 'deployed', 'failed')
});

// GET /api/tokens - Get all tokens
router.get('/', async (req, res) => {
  try {
    const tokens = await Token.findAll();
    res.json({
      success: true,
      data: tokens,
      count: tokens.length
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tokens'
    });
  }
});

// GET /api/tokens/:id - Get token by ID
router.get('/:id', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }
    
    res.json({
      success: true,
      data: token
    });
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch token'
    });
  }
});

// GET /api/tokens/owner/:address - Get tokens by owner
router.get('/owner/:address', async (req, res) => {
  try {
    const tokens = await Token.findByOwner(req.params.address);
    res.json({
      success: true,
      data: tokens,
      count: tokens.length
    });
  } catch (error) {
    console.error('Error fetching tokens by owner:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tokens'
    });
  }
});

// POST /api/tokens - Create new token
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createTokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    // Create token
    const token = await Token.create(value);
    
    // Create initial mint transaction
    await Transaction.create({
      token_id: token.id,
      type: 'Mint',
      amount: value.supply,
      recipient: 'Initial Supply',
      hash: `0x${Math.random().toString(16).substr(2, 8)}...`
    });

    res.status(201).json({
      success: true,
      data: token,
      message: 'Token created successfully'
    });
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create token'
    });
  }
});

// PUT /api/tokens/:id - Update token
router.put('/:id', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updateTokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    // Find token
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    // Update token
    const updatedToken = await token.update(value);

    res.json({
      success: true,
      data: updatedToken,
      message: 'Token updated successfully'
    });
  } catch (error) {
    console.error('Error updating token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update token'
    });
  }
});

// DELETE /api/tokens/:id - Delete token
router.delete('/:id', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    await token.delete();

    res.json({
      success: true,
      message: 'Token deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete token'
    });
  }
});

// POST /api/tokens/:id/deploy - Deploy token (simulate blockchain deployment)
router.post('/:id/deploy', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    if (token.status === 'deployed') {
      return res.status(400).json({
        success: false,
        error: 'Token already deployed'
      });
    }

    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock contract address
    const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    // Update token with deployed status and address
    await token.update({
      status: 'deployed',
      address: mockAddress
    });

    res.json({
      success: true,
      data: token,
      message: 'Token deployed successfully',
      contractAddress: mockAddress
    });
  } catch (error) {
    console.error('Error deploying token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deploy token'
    });
  }
});

export default router;
