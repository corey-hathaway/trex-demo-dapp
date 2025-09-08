"use strict";
// Shared constants for T-REX Demo Application
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.ROLES = exports.CLAIM_TOPICS = exports.ARTIFACT_PATHS = exports.CONTRACT_NAMES = void 0;
exports.CONTRACT_NAMES = {
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
};
exports.ARTIFACT_PATHS = {
    BASE: '../T-REX/artifacts-pvm/contracts',
    IMPLEMENTATIONS: '../T-REX/artifacts-pvm/@onchain-id/solidity/contracts',
    COMPLIANCE: '../T-REX/artifacts-pvm/contracts/compliance/legacy',
    PROXY: '../T-REX/artifacts-pvm/contracts/proxy'
};
exports.CLAIM_TOPICS = {
    INVESTOR_ACCREDITATION: 1,
    IDENTITY_VERIFICATION: 7,
    AML_VERIFICATION: 10
};
exports.ROLES = {
    AGENT_ROLE: '0x7265676973746572794167656e7400000000000000000000000000000000000000',
    OWNER_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000'
};
exports.ERROR_MESSAGES = {
    DEPLOYMENT_FAILED: 'Deployment failed',
    CONTRACT_NOT_FOUND: 'Contract not found',
    INVALID_ADDRESS: 'Invalid address format',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    TOKEN_PAUSED: 'Token is paused',
    UNAUTHORIZED: 'Unauthorized operation',
    NETWORK_ERROR: 'Network connection error'
};
//# sourceMappingURL=constants.js.map