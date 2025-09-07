import express from 'express';
import Joi from 'joi';
import { Transaction } from '../models/Transaction.js';
import { Token } from '../models/Token.js';

const router = express.Router();

// Validation schemas
const createTransactionSchema = Joi.object({
  token_id: Joi.string().required(),
  type: Joi.string().valid('Mint', 'Transfer', 'Burn').required(),
  amount: Joi.string().pattern(/^\d+$/).required(),
  recipient: Joi.string().required(),
  hash: Joi.string().optional()
});

const updateTransactionSchema = Joi.object({
  type: Joi.string().valid('Mint', 'Transfer', 'Burn'),
  amount: Joi.string().pattern(/^\d+$/),
  recipient: Joi.string(),
  hash: Joi.string(),
  status: Joi.string().valid('pending', 'confirmed', 'failed')
});

// GET /api/transactions - Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAllWithTokens();
    res.json({
      success: true,
      data: transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
});

// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction'
    });
  }
});

// GET /api/transactions/token/:tokenId - Get transactions by token ID
router.get('/token/:tokenId', async (req, res) => {
  try {
    const transactions = await Transaction.findByTokenId(req.params.tokenId);
    res.json({
      success: true,
      data: transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Error fetching transactions by token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    // Verify token exists
    const token = await Token.findById(value.token_id);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    // Create transaction
    const transaction = await Transaction.create(value);

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  }
});

// PUT /api/transactions/:id - Update transaction
router.put('/:id', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updateTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    // Find transaction
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Update transaction
    const updatedTransaction = await transaction.update(value);

    res.json({
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update transaction'
    });
  }
});

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    await transaction.delete();

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete transaction'
    });
  }
});

// POST /api/transactions/:id/confirm - Confirm transaction (simulate blockchain confirmation)
router.post('/:id/confirm', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    if (transaction.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        error: 'Transaction already confirmed'
      });
    }

    // Simulate confirmation process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock transaction hash if not provided
    const mockHash = transaction.hash || `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Update transaction with confirmed status
    await transaction.update({
      status: 'confirmed',
      hash: mockHash
    });

    res.json({
      success: true,
      data: transaction,
      message: 'Transaction confirmed successfully',
      hash: mockHash
    });
  } catch (error) {
    console.error('Error confirming transaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm transaction'
    });
  }
});

export default router;
