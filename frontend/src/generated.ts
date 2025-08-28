//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// agentManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const agentManagerAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AgentAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AgentRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isAgent',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const agentManagerAddress = {
  420420420: '0x493275370aF3f63d9ccd10a6539435121cF4fbb9',
} as const

/**
 *
 */
export const agentManagerConfig = {
  address: agentManagerAddress,
  abi: agentManagerAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// claimTopicsRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const claimTopicsRegistryAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimTopic',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ClaimTopicAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimTopic',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ClaimTopicRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [{ name: '_claimTopic', internalType: 'uint256', type: 'uint256' }],
    name: 'addClaimTopic',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getClaimTopics',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_claimTopic', internalType: 'uint256', type: 'uint256' }],
    name: 'removeClaimTopic',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const claimTopicsRegistryAddress = {
  420420420: '0x3649E46eCD6A0bd187f0046C4C35a7B31C92bA1E',
} as const

/**
 *
 */
export const claimTopicsRegistryConfig = {
  address: claimTopicsRegistryAddress,
  abi: claimTopicsRegistryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// defaultCompliance
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const defaultComplianceAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ModuleAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
    ],
    name: 'ModuleInteraction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_module',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ModuleRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenBound',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenUnbound',
  },
  {
    type: 'function',
    inputs: [{ name: '_module', internalType: 'address', type: 'address' }],
    name: 'addModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    name: 'bindToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callData', internalType: 'bytes', type: 'bytes' },
      { name: '_module', internalType: 'address', type: 'address' },
    ],
    name: 'callModuleFunction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'canTransfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'created',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'destroyed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getModules',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTokenBound',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_module', internalType: 'address', type: 'address' }],
    name: 'isModuleBound',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_module', internalType: 'address', type: 'address' }],
    name: 'removeModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferred',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    name: 'unbindToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const defaultComplianceAddress = {
  420420420: '0x746DFE0F96789e62CECeeA3CA2a9b5556b3AaD6c',
} as const

/**
 *
 */
export const defaultComplianceConfig = {
  address: defaultComplianceAddress,
  abi: defaultComplianceAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// identityRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const identityRegistryAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AgentAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AgentRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimTopicsRegistry',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ClaimTopicsRegistrySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'investorAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'country',
        internalType: 'uint16',
        type: 'uint16',
        indexed: true,
      },
    ],
    name: 'CountryUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'investorAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'identity',
        internalType: 'contract IIdentity',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'investorAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'identity',
        internalType: 'contract IIdentity',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'identityStorage',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityStorageSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldIdentity',
        internalType: 'contract IIdentity',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newIdentity',
        internalType: 'contract IIdentity',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'trustedIssuersRegistry',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TrustedIssuersRegistrySet',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddresses', internalType: 'address[]', type: 'address[]' },
      {
        name: '_identities',
        internalType: 'contract IIdentity[]',
        type: 'address[]',
      },
      { name: '_countries', internalType: 'uint16[]', type: 'uint16[]' },
    ],
    name: 'batchRegisterIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'contains',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'deleteIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'identity',
    outputs: [
      { name: '', internalType: 'contract IIdentity', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'identityStorage',
    outputs: [
      {
        name: '',
        internalType: 'contract IIdentityRegistryStorage',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trustedIssuersRegistry',
        internalType: 'address',
        type: 'address',
      },
      {
        name: '_claimTopicsRegistry',
        internalType: 'address',
        type: 'address',
      },
      { name: '_identityStorage', internalType: 'address', type: 'address' },
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'investorCountry',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isAgent',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'isVerified',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'issuersRegistry',
    outputs: [
      {
        name: '',
        internalType: 'contract ITrustedIssuersRegistry',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      {
        name: '_identity',
        internalType: 'contract IIdentity',
        type: 'address',
      },
      { name: '_country', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'registerIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_claimTopicsRegistry',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setClaimTopicsRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_identityRegistryStorage',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setIdentityRegistryStorage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trustedIssuersRegistry',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setTrustedIssuersRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'topicsRegistry',
    outputs: [
      {
        name: '',
        internalType: 'contract IClaimTopicsRegistry',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_country', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'updateCountry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      {
        name: '_identity',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'updateIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const identityRegistryAddress = {
  420420420: '0x294c664f6D63bd1521231a2EeFC26d805ce00a08',
} as const

/**
 *
 */
export const identityRegistryConfig = {
  address: identityRegistryAddress,
  abi: identityRegistryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// identityRegistryStorage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const identityRegistryStorageAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AgentAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AgentRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'investorAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'country',
        internalType: 'uint16',
        type: 'uint16',
        indexed: true,
      },
    ],
    name: 'CountryModified',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldIdentity',
        internalType: 'contract IIdentity',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newIdentity',
        internalType: 'contract IIdentity',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityModified',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'identityRegistry',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityRegistryBound',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'identityRegistry',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityRegistryUnbound',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'investorAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'identity',
        internalType: 'contract IIdentity',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityStored',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'investorAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'identity',
        internalType: 'contract IIdentity',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityUnstored',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      {
        name: '_identity',
        internalType: 'contract IIdentity',
        type: 'address',
      },
      { name: '_country', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'addIdentityToStorage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_identityRegistry', internalType: 'address', type: 'address' },
    ],
    name: 'bindIdentityRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isAgent',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'linkedIdentityRegistries',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      {
        name: '_identity',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'modifyStoredIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_country', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'modifyStoredInvestorCountry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'removeIdentityFromStorage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'storedIdentity',
    outputs: [
      { name: '', internalType: 'contract IIdentity', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'storedInvestorCountry',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_identityRegistry', internalType: 'address', type: 'address' },
    ],
    name: 'unbindIdentityRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const identityRegistryStorageAddress = {
  420420420: '0x598efcBD0B5b4Fd0142bEAae1a38f6Bd4d8a218d',
} as const

/**
 *
 */
export const identityRegistryStorageConfig = {
  address: identityRegistryStorageAddress,
  abi: identityRegistryStorageAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// token
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const tokenAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_userAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: '_isFrozen', internalType: 'bool', type: 'bool', indexed: true },
      {
        name: '_owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AddressFrozen',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AgentAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AgentRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_compliance',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ComplianceAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_identityRegistry',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IdentityRegistryAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_userAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_lostWallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_newWallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_investorOnchainID',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RecoverySuccess',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_userAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensFrozen',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_userAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensUnfrozen',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_userAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_newName',
        internalType: 'string',
        type: 'string',
        indexed: true,
      },
      {
        name: '_newSymbol',
        internalType: 'string',
        type: 'string',
        indexed: true,
      },
      {
        name: '_newDecimals',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: '_newVersion',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: '_newOnchainID',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'UpdatedTokenInformation',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_spender', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddresses', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'batchBurn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_fromList', internalType: 'address[]', type: 'address[]' },
      { name: '_toList', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'batchForcedTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddresses', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'batchFreezePartialTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_toList', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'batchMint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddresses', internalType: 'address[]', type: 'address[]' },
      { name: '_freeze', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'batchSetAddressFrozen',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_toList', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'batchTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddresses', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'batchUnfreezePartialTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'compliance',
    outputs: [
      {
        name: '',
        internalType: 'contract IModularCompliance',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_spender', internalType: 'address', type: 'address' },
      { name: '_subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'forcedTransfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'freezePartialTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getFrozenTokens',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'identityRegistry',
    outputs: [
      { name: '', internalType: 'contract IIdentityRegistry', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_spender', internalType: 'address', type: 'address' },
      { name: '_addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_identityRegistry', internalType: 'address', type: 'address' },
      { name: '_compliance', internalType: 'address', type: 'address' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_decimals', internalType: 'uint8', type: 'uint8' },
      { name: '_onchainID', internalType: 'address', type: 'address' },
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isAgent',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'isFrozen',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'onchainID',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_lostWallet', internalType: 'address', type: 'address' },
      { name: '_newWallet', internalType: 'address', type: 'address' },
      { name: '_investorOnchainID', internalType: 'address', type: 'address' },
    ],
    name: 'recoveryAddress',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_freeze', internalType: 'bool', type: 'bool' },
    ],
    name: 'setAddressFrozen',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_compliance', internalType: 'address', type: 'address' }],
    name: 'setCompliance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_identityRegistry', internalType: 'address', type: 'address' },
    ],
    name: 'setIdentityRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_name', internalType: 'string', type: 'string' }],
    name: 'setName',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_onchainID', internalType: 'address', type: 'address' }],
    name: 'setOnchainID',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_symbol', internalType: 'string', type: 'string' }],
    name: 'setSymbol',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'unfreezePartialTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
] as const

/**
 *
 */
export const tokenAddress = {
  420420420: '0xEC69d4f48f4f1740976968FAb9828d645Ad1d77f',
} as const

/**
 *
 */
export const tokenConfig = { address: tokenAddress, abi: tokenAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// tokenOID
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const tokenOidAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'implAddy', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_addr',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Deployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'factory',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TokenFactoryAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'factory',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TokenFactoryRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'identity',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TokenLinked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'wallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'identity',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'WalletLinked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'wallet',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'identity',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'WalletUnlinked',
  },
  {
    type: 'function',
    inputs: [{ name: '_factory', internalType: 'address', type: 'address' }],
    name: 'addTokenFactory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_wallet', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'string', type: 'string' },
    ],
    name: 'createIdentity',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_wallet', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'string', type: 'string' },
      { name: '_managementKeys', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'createIdentityWithManagementKeys',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_tokenOwner', internalType: 'address', type: 'address' },
      { name: '_salt', internalType: 'string', type: 'string' },
    ],
    name: 'createTokenIdentity',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_wallet', internalType: 'address', type: 'address' }],
    name: 'getIdentity',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_identity', internalType: 'address', type: 'address' }],
    name: 'getToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_identity', internalType: 'address', type: 'address' }],
    name: 'getWallets',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'implementationAuthority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_salt', internalType: 'string', type: 'string' }],
    name: 'isSaltTaken',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_factory', internalType: 'address', type: 'address' }],
    name: 'isTokenFactory',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_newWallet', internalType: 'address', type: 'address' }],
    name: 'linkWallet',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_factory', internalType: 'address', type: 'address' }],
    name: 'removeTokenFactory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_oldWallet', internalType: 'address', type: 'address' }],
    name: 'unlinkWallet',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const tokenOidAddress = {
  420420420: '0x82745827D0B8972eC0583B3100eCb30b81Db0072',
} as const

/**
 *
 */
export const tokenOidConfig = {
  address: tokenOidAddress,
  abi: tokenOidAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// trustedIssuersRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const trustedIssuersRegistryAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'trustedIssuer',
        internalType: 'contract IClaimIssuer',
        type: 'address',
        indexed: true,
      },
      {
        name: 'claimTopics',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'ClaimTopicsUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'trustedIssuer',
        internalType: 'contract IClaimIssuer',
        type: 'address',
        indexed: true,
      },
      {
        name: 'claimTopics',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TrustedIssuerAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'trustedIssuer',
        internalType: 'contract IClaimIssuer',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TrustedIssuerRemoved',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trustedIssuer',
        internalType: 'contract IClaimIssuer',
        type: 'address',
      },
      { name: '_claimTopics', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'addTrustedIssuer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trustedIssuer',
        internalType: 'contract IClaimIssuer',
        type: 'address',
      },
    ],
    name: 'getTrustedIssuerClaimTopics',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTrustedIssuers',
    outputs: [
      { name: '', internalType: 'contract IClaimIssuer[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'claimTopic', internalType: 'uint256', type: 'uint256' }],
    name: 'getTrustedIssuersForClaimTopic',
    outputs: [
      { name: '', internalType: 'contract IClaimIssuer[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_issuer', internalType: 'address', type: 'address' },
      { name: '_claimTopic', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasClaimTopic',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_issuer', internalType: 'address', type: 'address' }],
    name: 'isTrustedIssuer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trustedIssuer',
        internalType: 'contract IClaimIssuer',
        type: 'address',
      },
    ],
    name: 'removeTrustedIssuer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trustedIssuer',
        internalType: 'contract IClaimIssuer',
        type: 'address',
      },
      { name: '_claimTopics', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'updateIssuerClaimTopics',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const trustedIssuersRegistryAddress = {
  420420420: '0xb6F2B9415fc599130084b7F20B84738aCBB15930',
} as const

/**
 *
 */
export const trustedIssuersRegistryConfig = {
  address: trustedIssuersRegistryAddress,
  abi: trustedIssuersRegistryAbi,
} as const
