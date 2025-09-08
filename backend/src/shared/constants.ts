// Shared constants for T-REX Demo Application

export const CONTRACT_NAMES = {
  // Implementation Authorities
  IDENTITY_IMPLEMENTATION_AUTHORITY: 'ImplementationAuthority',
  TREX_IMPLEMENTATION_AUTHORITY: 'TREXImplementationAuthority',
  
  // Implementations
  IDENTITY_IMPLEMENTATION: 'Identity',
  CLAIM_TOPICS_IMPLEMENTATION: 'ClaimTopicsRegistry',
  TRUSTED_ISSUERS_IMPLEMENTATION: 'TrustedIssuersRegistry',
  IDENTITY_STORAGE_IMPLEMENTATION: 'IdentityRegistryStorage',
  IDENTITY_REGISTRY_IMPLEMENTATION: 'IdentityRegistry',
  COMPLIANCE_IMPLEMENTATION: 'ModularCompliance',
  TOKEN_IMPLEMENTATION: 'Token',
  
  // Factories
  TREX_FACTORY: 'TREXFactory',
  IDENTITY_FACTORY: 'IdFactory',
  
  // Registry Proxies
  TRUSTED_ISSUERS_REGISTRY: 'TrustedIssuersRegistryProxy',
  CLAIM_TOPICS_REGISTRY: 'ClaimTopicsRegistryProxy',
  IDENTITY_STORAGE: 'IdentityRegistryStorageProxy',
  IDENTITY_REGISTRY: 'IdentityRegistryProxy',
  
  // Other Contracts
  COMPLIANCE: 'ModularComplianceProxy',
  TOKEN: 'TokenProxy',
  TOKEN_OID: 'IdFactoryMock',
  AGENT_MANAGER: 'AgentManager'
} as const;

import path from 'path';

// Get the project root directory (2 levels up from backend/src/shared)
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

export const ARTIFACT_PATHS = {
  BASE: path.join(PROJECT_ROOT, 'T-REX/artifacts-pvm/contracts'),
  IMPLEMENTATIONS: path.join(PROJECT_ROOT, 'T-REX/artifacts-pvm/@onchain-id/solidity/contracts'),
  ONCHAIN_ID_PROXY: path.join(PROJECT_ROOT, 'T-REX/artifacts-pvm/@onchain-id/solidity/contracts/proxy'),
  COMPLIANCE: path.join(PROJECT_ROOT, 'T-REX/artifacts-pvm/contracts/compliance/legacy'),
  PROXY: path.join(PROJECT_ROOT, 'T-REX/artifacts-pvm/contracts/proxy')
} as const;

export const CLAIM_TOPICS = {
  INVESTOR_ACCREDITATION: 1,
  IDENTITY_VERIFICATION: 7,
  AML_VERIFICATION: 10
} as const;

export const ROLES = {
  AGENT_ROLE: '0x7265676973746572794167656e7400000000000000000000000000000000000000',
  OWNER_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000'
} as const;

export const ERROR_MESSAGES = {
  DEPLOYMENT_FAILED: 'Deployment failed',
  CONTRACT_NOT_FOUND: 'Contract not found',
  INVALID_ADDRESS: 'Invalid address format',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  TOKEN_PAUSED: 'Token is paused',
  UNAUTHORIZED: 'Unauthorized operation',
  NETWORK_ERROR: 'Network connection error'
} as const;

export const POLKADOT_CONFIG = {
  wsUrl: 'ws://localhost:9944',
  types: {},
  isDevelopment: true
} as const;
