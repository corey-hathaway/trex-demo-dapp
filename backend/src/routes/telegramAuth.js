import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage for demo purposes (in production, use a database)
const challenges = new Map();
const sessions = new Map();

// Generate a challenge for Telegram authentication
router.post('/challenge', async (req, res) => {
  try {
    const { message, client_id } = req.body;
    
    if (!message || !client_id) {
      return res.status(400).json({
        success: false,
        error: 'Message and client_id are required'
      });
    }

    const challengeId = uuidv4();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const challenge = {
      id: challengeId,
      message,
      client_id,
      status: 'pending',
      expiresAt,
      createdAt: new Date(),
      qrCode: `https://quickchart.io/qr?text=${encodeURIComponent(`https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=${challengeId}`)}&size=200`,
      deepLink: `https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?start=${challengeId}`
    };

    challenges.set(challengeId, challenge);

    res.json({
      success: true,
      challenge: {
        id: challengeId,
        message,
        expiresAt,
        qrCode: challenge.qrCode,
        deepLink: challenge.deepLink
      }
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create authentication challenge'
    });
  }
});

// Check authentication status
router.get('/status/:challengeId', (req, res) => {
  try {
    const { challengeId } = req.params;
    const challenge = challenges.get(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check if expired
    if (new Date() > challenge.expiresAt) {
      challenge.status = 'expired';
      challenges.delete(challengeId);
      return res.json({
        success: true,
        challenge: {
          ...challenge,
          status: 'expired'
        }
      });
    }

    res.json({
      success: true,
      challenge: {
        id: challenge.id,
        status: challenge.status,
        message: challenge.message,
        expiresAt: challenge.expiresAt,
        walletAddress: challenge.walletAddress,
        userId: challenge.userId,
        username: challenge.username,
        completedAt: challenge.completedAt
      }
    });
  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check authentication status'
    });
  }
});

// Simulate authentication completion (for demo purposes)
router.post('/complete/:challengeId', (req, res) => {
  try {
    const { challengeId } = req.params;
    const { walletAddress, userId } = req.body;

    const challenge = challenges.get(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    if (new Date() > challenge.expiresAt) {
      return res.status(400).json({
        success: false,
        error: 'Challenge has expired'
      });
    }

    // Update challenge status
    challenge.status = 'completed';
    challenge.walletAddress = walletAddress;
    challenge.userId = userId;
    challenge.completedAt = new Date();

    // Create session
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      challengeId,
      walletAddress,
      userId,
      createdAt: new Date()
    };

    sessions.set(sessionId, session);

    res.json({
      success: true,
      message: 'Authentication completed successfully',
      session: {
        id: sessionId,
        walletAddress,
        userId
      }
    });
  } catch (error) {
    console.error('Error completing authentication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete authentication'
    });
  }
});

// Webhook endpoint for Telegram bot
router.post('/webhook', (req, res) => {
  try {
    const { message, callback_query } = req.body;
    
    console.log('Telegram webhook received:', { message, callback_query });
    
    // Handle /start command with challenge ID
    if (message && message.text && message.text.startsWith('/start')) {
      const challengeId = message.text.split(' ')[1]; // Extract challenge ID from /start <challengeId>
      const userId = message.from.id;
      const username = message.from.username || message.from.first_name;
      
      console.log(`User ${username} (${userId}) started authentication with challenge ${challengeId}`);
      
      if (challengeId) {
        const challenge = challenges.get(challengeId);
        
        if (challenge && challenge.status === 'pending') {
          // Update challenge status to completed
          challenge.status = 'completed';
          challenge.userId = userId;
          challenge.username = username;
          challenge.completedAt = new Date();
          
          // Create session
          const sessionId = uuidv4();
          const session = {
            id: sessionId,
            challengeId,
            userId,
            username,
            createdAt: new Date()
          };
          sessions.set(sessionId, session);
          
          console.log(`✅ Authentication completed for user ${username} with challenge ${challengeId}`);
          
          // Send confirmation message to user
          // Note: In a real implementation, you'd use the Telegram Bot API to send a message
          // For now, we'll just log it
          console.log(`📱 Should send message to user: "Authentication successful! You can now close this chat and return to the app."`);
        } else {
          console.log(`❌ Invalid or expired challenge: ${challengeId}`);
        }
      } else {
        console.log('❌ No challenge ID provided in /start command');
      }
    }
    
    res.json({
      success: true,
      message: 'Webhook processed'
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    });
  }
});

// Get session info
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      session: {
        id: session.id,
        walletAddress: session.walletAddress,
        userId: session.userId,
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session info'
    });
  }
});

export default router;
