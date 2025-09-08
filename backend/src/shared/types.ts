// Shared types for T-REX Demo Application

export interface DeploymentRequest {
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
}

export interface DeploymentResponse {
  deploymentId: string;
  status: DeploymentStatus;
  contracts?: DeployedContracts;
  currentStep?: string;
  progress?: number;
  error?: string;
}

export interface DeployedContracts {
  trustedIssuersRegistry: string;
  claimTopicsRegistry: string;
  identityStorage: string;
  identityRegistry: string;
  compliance: string;
  token: string;
  tokenOID: string;
  agentManager?: string;
  // Implementation contracts
  identityImplementationAuthority: string;
  identityImplementation: string;
  trexImplementationAuthority: string;
  claimTopicsImplementation: string;
  trustedIssuersImplementation: string;
  identityStorageImplementation: string;
  identityRegistryImplementation: string;
  complianceImplementation: string;
  tokenImplementation: string;
  trexFactory: string;
  identityFactory: string;
}

export type DeploymentStatus = 'pending' | 'deploying' | 'complete' | 'error';

export interface MintRequest {
  tokenAddress: string;
  to: string;
  amount: string;
}

export interface TransferRequest {
  tokenAddress: string;
  from: string;
  to: string;
  amount: string;
}

export interface TransactionResponse {
  success: boolean;
  transactionHash: string;
  error?: string;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  paused: boolean;
  owner: string;
  contractAddress: string;
}

export interface BalanceInfo {
  balance: string;
  frozen: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Deployment step tracking
export interface DeploymentStep {
  name: string;
  description: string;
  completed: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
}

export const DEPLOYMENT_STEPS = [
  'Deploy Identity Implementation Authority',
  'Deploy Identity Implementation',
  'Deploy T-REX Implementation Authority', 
  'Deploy Claim Topics Implementation',
  'Deploy Trusted Issuers Implementation',
  'Deploy Identity Storage Implementation',
  'Deploy Identity Registry Implementation',
  'Deploy Compliance Implementation',
  'Deploy Token Implementation',
  'Deploy T-REX Factory',
  'Deploy Identity Factory',
  'Deploy Trusted Issuers Registry',
  'Deploy Claim Topics Registry',
  'Deploy Identity Storage',
  'Deploy Identity Registry',
  'Deploy Default Compliance',
  'Deploy Token OnchainID',
  'Deploy Token',
  'Bind Registry to Token',
  'Set Compliance on Token',
  'Add Agent Role',
  'Deploy Agent Manager',
  'Bind Agent Manager',
  'Complete Deployment'
] as const;
