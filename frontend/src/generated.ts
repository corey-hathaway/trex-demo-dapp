//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// agentManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const agentManagerAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
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
        name: '_agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: '_role', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'RoleAdded',
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
      { name: '_role', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'RoleRemoved',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addAgentAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addComplianceAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addFreezer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addRecoveryAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addSupplyModifier',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addTransferManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'addWhiteListManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddresses', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callBatchBurn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_fromList', internalType: 'address[]', type: 'address[]' },
      { name: '_toList', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callBatchForcedTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddresses', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callBatchFreezePartialTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_toList', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callBatchMint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddresses', internalType: 'address[]', type: 'address[]' },
      { name: '_freeze', internalType: 'bool[]', type: 'bool[]' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callBatchSetAddressFrozen',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddresses', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callBatchUnfreezePartialTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callBurn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callDeleteIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callForcedTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callFreezePartialTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callMint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callPause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_lostWallet', internalType: 'address', type: 'address' },
      { name: '_newWallet', internalType: 'address', type: 'address' },
      { name: '_onchainID', internalType: 'address', type: 'address' },
      {
        name: '_managerOnchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callRecoveryAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
      { name: '_country', internalType: 'uint16', type: 'uint16' },
      {
        name: '_managerOnchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callRegisterIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_freeze', internalType: 'bool', type: 'bool' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callSetAddressFrozen',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callUnfreezePartialTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callUnpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      { name: '_country', internalType: 'uint16', type: 'uint16' },
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callUpdateCountry',
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
      {
        name: '_onchainID',
        internalType: 'contract IIdentity',
        type: 'address',
      },
    ],
    name: 'callUpdateIdentity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isAgentAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isComplianceAgent',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isFreezer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isRecoveryAgent',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isSupplyModifier',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isTransferManager',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'isWhiteListManager',
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
    name: 'removeAgentAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeComplianceAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeFreezer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeRecoveryAgent',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeSupplyModifier',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeTransferManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_agent', internalType: 'address', type: 'address' }],
    name: 'removeWhiteListManager',
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
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'contract IToken', type: 'address' }],
    stateMutability: 'view',
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
// claimIssuerContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const claimIssuerContractAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'initialManagementKey',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'Approved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'topic',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'scheme',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'issuer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'signature',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'uri', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ClaimAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'topic',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'scheme',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'issuer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'signature',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'uri', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ClaimChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'topic',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'scheme',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'issuer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'signature',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'uri', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ClaimRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signature',
        internalType: 'bytes',
        type: 'bytes',
        indexed: true,
      },
    ],
    name: 'ClaimRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Executed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ExecutionFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ExecutionRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'purpose',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'keyType',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'KeyAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'purpose',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'keyType',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'KeyRemoved',
  },
  {
    type: 'function',
    inputs: [
      { name: '_topic', internalType: 'uint256', type: 'uint256' },
      { name: '_scheme', internalType: 'uint256', type: 'uint256' },
      { name: '_issuer', internalType: 'address', type: 'address' },
      { name: '_signature', internalType: 'bytes', type: 'bytes' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
      { name: '_uri', internalType: 'string', type: 'string' },
    ],
    name: 'addClaim',
    outputs: [
      { name: 'claimRequestId', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_purpose', internalType: 'uint256', type: 'uint256' },
      { name: '_type', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addKey',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_approve', internalType: 'bool', type: 'bool' },
    ],
    name: 'approve',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [
      { name: 'executionId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_claimId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getClaim',
    outputs: [
      { name: 'topic', internalType: 'uint256', type: 'uint256' },
      { name: 'scheme', internalType: 'uint256', type: 'uint256' },
      { name: 'issuer', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'uri', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_topic', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIdsByTopic',
    outputs: [
      { name: 'claimIds', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getKey',
    outputs: [
      { name: 'purposes', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'keyType', internalType: 'uint256', type: 'uint256' },
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getKeyPurposes',
    outputs: [
      { name: '_purposes', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_purpose', internalType: 'uint256', type: 'uint256' }],
    name: 'getKeysByPurpose',
    outputs: [{ name: 'keys', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sig', internalType: 'bytes', type: 'bytes' },
      { name: 'dataHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getRecoveredAddress',
    outputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'initialManagementKey',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_sig', internalType: 'bytes', type: 'bytes' }],
    name: 'isClaimRevoked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_identity',
        internalType: 'contract IIdentity',
        type: 'address',
      },
      { name: 'claimTopic', internalType: 'uint256', type: 'uint256' },
      { name: 'sig', internalType: 'bytes', type: 'bytes' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isClaimValid',
    outputs: [{ name: 'claimValid', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_purpose', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'keyHasPurpose',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_claimId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'removeClaim',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_purpose', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeKey',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_identity', internalType: 'address', type: 'address' },
    ],
    name: 'revokeClaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'signature', internalType: 'bytes', type: 'bytes' }],
    name: 'revokeClaimBySignature',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'revokedClaims',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
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
export const claimIssuerContractAddress = {
  420420420: '0xab7785d56697E65c2683c8121Aac93D3A028Ba95',
} as const

/**
 *
 */
export const claimIssuerContractConfig = {
  address: claimIssuerContractAddress,
  abi: claimIssuerContractAbi,
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
// claimTopicsRegistryImplementation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const claimTopicsRegistryImplementationAbi = [
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
export const claimTopicsRegistryImplementationAddress = {
  420420420: '0xc01Ee7f10EA4aF4673cFff62710E1D7792aBa8f3',
} as const

/**
 *
 */
export const claimTopicsRegistryImplementationConfig = {
  address: claimTopicsRegistryImplementationAddress,
  abi: claimTopicsRegistryImplementationAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// claimtopicsregistryproxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const claimtopicsregistryproxyAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'implementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_implementationAuthority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ImplementationAuthoritySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementationAuthority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_newImplementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setImplementationAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

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
// identityFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const identityFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'implementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
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
export const identityFactoryAddress = {
  420420420: '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
} as const

/**
 *
 */
export const identityFactoryConfig = {
  address: identityFactoryAddress,
  abi: identityFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// identityImplementation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const identityImplementationAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'initialManagementKey',
        internalType: 'address',
        type: 'address',
      },
      { name: '_isLibrary', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'Approved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'topic',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'scheme',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'issuer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'signature',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'uri', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ClaimAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'topic',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'scheme',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'issuer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'signature',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'uri', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ClaimChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'topic',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'scheme',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'issuer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'signature',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'uri', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ClaimRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Executed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ExecutionFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'executionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ExecutionRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'purpose',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'keyType',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'KeyAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'key', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'purpose',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'keyType',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'KeyRemoved',
  },
  {
    type: 'function',
    inputs: [
      { name: '_topic', internalType: 'uint256', type: 'uint256' },
      { name: '_scheme', internalType: 'uint256', type: 'uint256' },
      { name: '_issuer', internalType: 'address', type: 'address' },
      { name: '_signature', internalType: 'bytes', type: 'bytes' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
      { name: '_uri', internalType: 'string', type: 'string' },
    ],
    name: 'addClaim',
    outputs: [
      { name: 'claimRequestId', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_purpose', internalType: 'uint256', type: 'uint256' },
      { name: '_type', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addKey',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_approve', internalType: 'bool', type: 'bool' },
    ],
    name: 'approve',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [
      { name: 'executionId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_claimId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getClaim',
    outputs: [
      { name: 'topic', internalType: 'uint256', type: 'uint256' },
      { name: 'scheme', internalType: 'uint256', type: 'uint256' },
      { name: 'issuer', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'uri', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_topic', internalType: 'uint256', type: 'uint256' }],
    name: 'getClaimIdsByTopic',
    outputs: [
      { name: 'claimIds', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getKey',
    outputs: [
      { name: 'purposes', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'keyType', internalType: 'uint256', type: 'uint256' },
      { name: 'key', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getKeyPurposes',
    outputs: [
      { name: '_purposes', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_purpose', internalType: 'uint256', type: 'uint256' }],
    name: 'getKeysByPurpose',
    outputs: [{ name: 'keys', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sig', internalType: 'bytes', type: 'bytes' },
      { name: 'dataHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getRecoveredAddress',
    outputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'initialManagementKey',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_identity',
        internalType: 'contract IIdentity',
        type: 'address',
      },
      { name: 'claimTopic', internalType: 'uint256', type: 'uint256' },
      { name: 'sig', internalType: 'bytes', type: 'bytes' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isClaimValid',
    outputs: [{ name: 'claimValid', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_purpose', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'keyHasPurpose',
    outputs: [{ name: 'result', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_claimId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'removeClaim',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_key', internalType: 'bytes32', type: 'bytes32' },
      { name: '_purpose', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeKey',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
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
export const identityImplementationAddress = {
  420420420: '0x21cb3940e6Ba5284E1750F1109131a8E8062b9f1',
} as const

/**
 *
 */
export const identityImplementationConfig = {
  address: identityImplementationAddress,
  abi: identityImplementationAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// identityImplementationAuthority
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const identityImplementationAuthorityAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
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
        name: 'newAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'UpdatedImplementation',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementation',
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
      { name: '_newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'updateImplementation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const identityImplementationAuthorityAddress = {
  420420420: '0x3469E1DaC06611030AEce8209F07501E9A7aCC69',
} as const

/**
 *
 */
export const identityImplementationAuthorityConfig = {
  address: identityImplementationAuthorityAddress,
  abi: identityImplementationAuthorityAbi,
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
// identityRegistryImplementation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const identityRegistryImplementationAbi = [
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
export const identityRegistryImplementationAddress = {
  420420420: '0x962c0940d72E7Db6c9a5F81f1cA87D8DB2B82A23',
} as const

/**
 *
 */
export const identityRegistryImplementationConfig = {
  address: identityRegistryImplementationAddress,
  abi: identityRegistryImplementationAbi,
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
// identityRegistryStorageImplementation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const identityRegistryStorageImplementationAbi = [
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
export const identityRegistryStorageImplementationAddress = {
  420420420: '0x3ed62137c5DB927cb137c26455969116BF0c23Cb',
} as const

/**
 *
 */
export const identityRegistryStorageImplementationConfig = {
  address: identityRegistryStorageImplementationAddress,
  abi: identityRegistryStorageImplementationAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// identityregistryproxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const identityregistryproxyAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'implementationAuthority',
        internalType: 'address',
        type: 'address',
      },
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
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_implementationAuthority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ImplementationAuthoritySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementationAuthority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_newImplementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setImplementationAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// identityregistrystorageproxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const identityregistrystorageproxyAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'implementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_implementationAuthority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ImplementationAuthoritySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementationAuthority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_newImplementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setImplementationAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// modularComplianceImplementation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const modularComplianceImplementationAbi = [
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
export const modularComplianceImplementationAddress = {
  420420420: '0x5CC307268a1393AB9A764A20DACE848AB8275c46',
} as const

/**
 *
 */
export const modularComplianceImplementationConfig = {
  address: modularComplianceImplementationAddress,
  abi: modularComplianceImplementationAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// modularcomplianceproxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const modularcomplianceproxyAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'implementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_implementationAuthority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ImplementationAuthoritySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementationAuthority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_newImplementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setImplementationAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

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
// tokenImplementation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const tokenImplementationAbi = [
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
export const tokenImplementationAddress = {
  420420420: '0xeAB4eEBa1FF8504c124D031F6844AD98d07C318f',
} as const

/**
 *
 */
export const tokenImplementationConfig = {
  address: tokenImplementationAddress,
  abi: tokenImplementationAbi,
} as const

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
// tokenproxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenproxyAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'implementationAuthority',
        internalType: 'address',
        type: 'address',
      },
      { name: '_identityRegistry', internalType: 'address', type: 'address' },
      { name: '_compliance', internalType: 'address', type: 'address' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_decimals', internalType: 'uint8', type: 'uint8' },
      { name: '_onchainID', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_implementationAuthority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ImplementationAuthoritySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementationAuthority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_newImplementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setImplementationAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// trexFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const trexFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'implementationAuthority_',
        internalType: 'address',
        type: 'address',
      },
      { name: 'idFactory_', internalType: 'address', type: 'address' },
    ],
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
        name: '_idFactory',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'IdFactorySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_implementationAuthority',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ImplementationAuthoritySet',
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
        indexed: true,
      },
      { name: '_ir', internalType: 'address', type: 'address', indexed: false },
      {
        name: '_irs',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_tir',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_ctr',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: '_mc', internalType: 'address', type: 'address', indexed: false },
      { name: '_salt', internalType: 'string', type: 'string', indexed: true },
    ],
    name: 'TREXSuiteDeployed',
  },
  {
    type: 'function',
    inputs: [
      { name: '_salt', internalType: 'string', type: 'string' },
      {
        name: '_tokenDetails',
        internalType: 'struct ITREXFactory.TokenDetails',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'decimals', internalType: 'uint8', type: 'uint8' },
          { name: 'irs', internalType: 'address', type: 'address' },
          { name: 'ONCHAINID', internalType: 'address', type: 'address' },
          { name: 'irAgents', internalType: 'address[]', type: 'address[]' },
          { name: 'tokenAgents', internalType: 'address[]', type: 'address[]' },
          {
            name: 'complianceModules',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'complianceSettings',
            internalType: 'bytes[]',
            type: 'bytes[]',
          },
        ],
      },
      {
        name: '_claimDetails',
        internalType: 'struct ITREXFactory.ClaimDetails',
        type: 'tuple',
        components: [
          { name: 'claimTopics', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'issuers', internalType: 'address[]', type: 'address[]' },
          {
            name: 'issuerClaims',
            internalType: 'uint256[][]',
            type: 'uint256[][]',
          },
        ],
      },
    ],
    name: 'deployTREXSuite',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getIdFactory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementationAuthority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_salt', internalType: 'string', type: 'string' }],
    name: 'getToken',
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
    inputs: [
      { name: '_contract', internalType: 'address', type: 'address' },
      { name: '_newOwner', internalType: 'address', type: 'address' },
    ],
    name: 'recoverContractOwnership',
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
    inputs: [{ name: 'idFactory_', internalType: 'address', type: 'address' }],
    name: 'setIdFactory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'implementationAuthority_',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setImplementationAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'string', type: 'string' }],
    name: 'tokenDeployed',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
export const trexFactoryAddress = {
  420420420: '0xd528a533599223CA6B5EBdd1C32A241432FB1AE8',
} as const

/**
 *
 */
export const trexFactoryConfig = {
  address: trexFactoryAddress,
  abi: trexFactoryAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// trexImplementationAuthority
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const trexImplementationAuthorityAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'referenceStatus', internalType: 'bool', type: 'bool' },
      { name: 'trexFactory', internalType: 'address', type: 'address' },
      { name: 'iaFactory', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'iaFactory',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'IAFactorySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_newImplementationAuthority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ImplementationAuthorityChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'referenceStatus',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
      {
        name: 'trexFactory',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ImplementationAuthoritySet',
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
        name: 'trexFactory',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TREXFactorySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'struct ITREXImplementationAuthority.Version',
        type: 'tuple',
        components: [
          { name: 'major', internalType: 'uint8', type: 'uint8' },
          { name: 'minor', internalType: 'uint8', type: 'uint8' },
          { name: 'patch', internalType: 'uint8', type: 'uint8' },
        ],
        indexed: true,
      },
      {
        name: 'trex',
        internalType: 'struct ITREXImplementationAuthority.TREXContracts',
        type: 'tuple',
        components: [
          {
            name: 'tokenImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'ctrImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irsImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tirImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'mcImplementation',
            internalType: 'address',
            type: 'address',
          },
        ],
        indexed: true,
      },
    ],
    name: 'TREXVersionAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'struct ITREXImplementationAuthority.Version',
        type: 'tuple',
        components: [
          { name: 'major', internalType: 'uint8', type: 'uint8' },
          { name: 'minor', internalType: 'uint8', type: 'uint8' },
          { name: 'patch', internalType: 'uint8', type: 'uint8' },
        ],
        indexed: true,
      },
      {
        name: 'trex',
        internalType: 'struct ITREXImplementationAuthority.TREXContracts',
        type: 'tuple',
        components: [
          {
            name: 'tokenImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'ctrImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irsImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tirImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'mcImplementation',
            internalType: 'address',
            type: 'address',
          },
        ],
        indexed: true,
      },
    ],
    name: 'TREXVersionFetched',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'struct ITREXImplementationAuthority.Version',
        type: 'tuple',
        components: [
          { name: 'major', internalType: 'uint8', type: 'uint8' },
          { name: 'minor', internalType: 'uint8', type: 'uint8' },
          { name: 'patch', internalType: 'uint8', type: 'uint8' },
        ],
        indexed: true,
      },
    ],
    name: 'VersionUpdated',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_version',
        internalType: 'struct ITREXImplementationAuthority.Version',
        type: 'tuple',
        components: [
          { name: 'major', internalType: 'uint8', type: 'uint8' },
          { name: 'minor', internalType: 'uint8', type: 'uint8' },
          { name: 'patch', internalType: 'uint8', type: 'uint8' },
        ],
      },
      {
        name: '_trex',
        internalType: 'struct ITREXImplementationAuthority.TREXContracts',
        type: 'tuple',
        components: [
          {
            name: 'tokenImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'ctrImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irsImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tirImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'mcImplementation',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    name: 'addAndUseTREXVersion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_version',
        internalType: 'struct ITREXImplementationAuthority.Version',
        type: 'tuple',
        components: [
          { name: 'major', internalType: 'uint8', type: 'uint8' },
          { name: 'minor', internalType: 'uint8', type: 'uint8' },
          { name: 'patch', internalType: 'uint8', type: 'uint8' },
        ],
      },
      {
        name: '_trex',
        internalType: 'struct ITREXImplementationAuthority.TREXContracts',
        type: 'tuple',
        components: [
          {
            name: 'tokenImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'ctrImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irsImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tirImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'mcImplementation',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    name: 'addTREXVersion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      {
        name: '_newImplementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'changeImplementationAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_version',
        internalType: 'struct ITREXImplementationAuthority.Version',
        type: 'tuple',
        components: [
          { name: 'major', internalType: 'uint8', type: 'uint8' },
          { name: 'minor', internalType: 'uint8', type: 'uint8' },
          { name: 'patch', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    name: 'fetchVersion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCTRImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_version',
        internalType: 'struct ITREXImplementationAuthority.Version',
        type: 'tuple',
        components: [
          { name: 'major', internalType: 'uint8', type: 'uint8' },
          { name: 'minor', internalType: 'uint8', type: 'uint8' },
          { name: 'patch', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    name: 'getContracts',
    outputs: [
      {
        name: '',
        internalType: 'struct ITREXImplementationAuthority.TREXContracts',
        type: 'tuple',
        components: [
          {
            name: 'tokenImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'ctrImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'irsImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tirImplementation',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'mcImplementation',
            internalType: 'address',
            type: 'address',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentVersion',
    outputs: [
      {
        name: '',
        internalType: 'struct ITREXImplementationAuthority.Version',
        type: 'tuple',
        components: [
          { name: 'major', internalType: 'uint8', type: 'uint8' },
          { name: 'minor', internalType: 'uint8', type: 'uint8' },
          { name: 'patch', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getIRImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getIRSImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMCImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReferenceContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTIRImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTREXFactory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTokenImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isReferenceContract',
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
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'iaFactory', internalType: 'address', type: 'address' }],
    name: 'setIAFactory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'trexFactory', internalType: 'address', type: 'address' }],
    name: 'setTREXFactory',
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
        name: '_version',
        internalType: 'struct ITREXImplementationAuthority.Version',
        type: 'tuple',
        components: [
          { name: 'major', internalType: 'uint8', type: 'uint8' },
          { name: 'minor', internalType: 'uint8', type: 'uint8' },
          { name: 'patch', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    name: 'useTREXVersion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 *
 */
export const trexImplementationAuthorityAddress = {
  420420420: '0x867fb76BA206040EA09e73f38EdA307413d4966F',
} as const

/**
 *
 */
export const trexImplementationAuthorityConfig = {
  address: trexImplementationAuthorityAddress,
  abi: trexImplementationAuthorityAbi,
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// trustedIssuersRegistryImplementation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const trustedIssuersRegistryImplementationAbi = [
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
export const trustedIssuersRegistryImplementationAddress = {
  420420420: '0x970951a12F975E6762482ACA81E57D5A2A4e73F4',
} as const

/**
 *
 */
export const trustedIssuersRegistryImplementationConfig = {
  address: trustedIssuersRegistryImplementationAddress,
  abi: trustedIssuersRegistryImplementationAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// trustedissuersregistryproxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const trustedissuersregistryproxyAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'implementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_implementationAuthority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ImplementationAuthoritySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementationAuthority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_newImplementationAuthority',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setImplementationAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const
