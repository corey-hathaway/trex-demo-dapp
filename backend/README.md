# T-REX Demo Backend

Backend service for T-REX tokenization demo with Polkadot PVM integration.

## Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   - Replace `PRIVATE_KEY` with your demo account private key
   - Adjust `RPC_URL` if using a different network
   - Modify `CORS_ORIGIN` to match your frontend URL

## Installation

```bash
npm install
npm run build
npm start
```

## Features

- **Hybrid Deployment**: PVM code upload + Ethereum compatibility layer
- **Massive Gas Override**: Handles large PVM contract deployments
- **T-REX Integration**: Compatible with T-REX factory deployment patterns

## API Endpoints

- `POST /api/test/simple-deploy` - Test contract deployment
- `POST /api/deploy/full` - Full T-REX suite deployment

## Development

```bash
npm run dev  # Development mode with hot reload
npm run build # Build TypeScript
npm run test # Run tests
```
