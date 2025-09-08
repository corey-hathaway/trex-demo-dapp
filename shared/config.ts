// Shared configuration for T-REX Demo Application

export const NETWORK_CONFIG = {
  chainId: 420420420,
  rpcUrl: 'http://localhost:8545',
  name: 'Asset Hub Local',
  currency: 'DOT'
} as const;

export const CONTRACT_CONFIG = {
  // Gas settings
  gasLimit: 30000000,
  gasPrice: '20000000000', // 20 gwei
  
  // Deployment settings
  allowUnlimitedContractSize: true,
  timeout: 120000, // 2 minutes
  
  // Agent roles
  agentRole: '0x7265676973746572794167656e7400000000000000000000000000000000000000'
} as const;

export const API_CONFIG = {
  baseUrl: 'http://localhost:3001/api',
  timeout: 30000,
  retries: 3
} as const;

// Default addresses for demo
export const DEMO_ADDRESSES = {
  alice: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
  bob: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  charlie: '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
} as const;

