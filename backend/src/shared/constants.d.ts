export declare const CONTRACT_NAMES: {
    readonly IDENTITY_IMPLEMENTATION_AUTHORITY: "ImplementationAuthority";
    readonly TREX_IMPLEMENTATION_AUTHORITY: "TREXImplementationAuthority";
    readonly IDENTITY_IMPLEMENTATION: "Identity";
    readonly CLAIM_TOPICS_IMPLEMENTATION: "ClaimTopicsRegistry";
    readonly TRUSTED_ISSUERS_IMPLEMENTATION: "TrustedIssuersRegistry";
    readonly IDENTITY_STORAGE_IMPLEMENTATION: "IdentityRegistryStorage";
    readonly IDENTITY_REGISTRY_IMPLEMENTATION: "IdentityRegistry";
    readonly COMPLIANCE_IMPLEMENTATION: "ModularCompliance";
    readonly TOKEN_IMPLEMENTATION: "Token";
    readonly TREX_FACTORY: "TREXFactory";
    readonly IDENTITY_FACTORY: "IdFactory";
    readonly TRUSTED_ISSUERS_REGISTRY: "TrustedIssuersRegistryProxy";
    readonly CLAIM_TOPICS_REGISTRY: "ClaimTopicsRegistryProxy";
    readonly IDENTITY_STORAGE: "IdentityRegistryStorageProxy";
    readonly IDENTITY_REGISTRY: "IdentityRegistryProxy";
    readonly COMPLIANCE: "ModularComplianceProxy";
    readonly TOKEN: "TokenProxy";
    readonly TOKEN_OID: "IdFactoryMock";
    readonly AGENT_MANAGER: "AgentManager";
};
export declare const ARTIFACT_PATHS: {
    readonly BASE: "../T-REX/artifacts-pvm/contracts";
    readonly IMPLEMENTATIONS: "../T-REX/artifacts-pvm/@onchain-id/solidity/contracts";
    readonly COMPLIANCE: "../T-REX/artifacts-pvm/contracts/compliance/legacy";
    readonly PROXY: "../T-REX/artifacts-pvm/contracts/proxy";
};
export declare const CLAIM_TOPICS: {
    readonly INVESTOR_ACCREDITATION: 1;
    readonly IDENTITY_VERIFICATION: 7;
    readonly AML_VERIFICATION: 10;
};
export declare const ROLES: {
    readonly AGENT_ROLE: "0x7265676973746572794167656e7400000000000000000000000000000000000000";
    readonly OWNER_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000000";
};
export declare const ERROR_MESSAGES: {
    readonly DEPLOYMENT_FAILED: "Deployment failed";
    readonly CONTRACT_NOT_FOUND: "Contract not found";
    readonly INVALID_ADDRESS: "Invalid address format";
    readonly INSUFFICIENT_BALANCE: "Insufficient balance";
    readonly TOKEN_PAUSED: "Token is paused";
    readonly UNAUTHORIZED: "Unauthorized operation";
    readonly NETWORK_ERROR: "Network connection error";
};
//# sourceMappingURL=constants.d.ts.map