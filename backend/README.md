# T-REX Demo Backend

A simple Node.js/Express backend API for the T-REX Demo dApp that handles token operations and transactions.

## Features

- **Token Management**: Create, read, update, delete tokens
- **Transaction Tracking**: Record and manage token transactions
- **SQLite Database**: Persistent storage for tokens and transactions
- **RESTful API**: Clean API endpoints for frontend integration
- **CORS Support**: Configured for frontend communication
- **Input Validation**: Joi validation for all API endpoints

## API Endpoints

### Tokens
- `GET /api/tokens` - Get all tokens
- `GET /api/tokens/:id` - Get token by ID
- `GET /api/tokens/owner/:address` - Get tokens by owner address
- `POST /api/tokens` - Create new token
- `PUT /api/tokens/:id` - Update token
- `DELETE /api/tokens/:id` - Delete token
- `POST /api/tokens/:id/deploy` - Deploy token (simulate blockchain deployment)

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/transactions/token/:tokenId` - Get transactions by token ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `POST /api/transactions/:id/confirm` - Confirm transaction

### Health
- `GET /health` - Health check endpoint

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The server will start on port 3001 by default.

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `DATABASE_PATH` - SQLite database path (default: ./data/tokens.db)

## Database Schema

### Tokens Table
- `id` - Unique token identifier
- `name` - Token name
- `symbol` - Token symbol
- `supply` - Token supply
- `decimals` - Token decimals
- `address` - Contract address (null until deployed)
- `owner_address` - Wallet address of token owner
- `status` - Token status (pending/deployed/failed)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Transactions Table
- `id` - Unique transaction identifier
- `token_id` - Reference to token
- `type` - Transaction type (Mint/Transfer/Burn)
- `amount` - Transaction amount
- `recipient` - Recipient address
- `hash` - Transaction hash (null until confirmed)
- `status` - Transaction status (pending/confirmed/failed)
- `created_at` - Creation timestamp
