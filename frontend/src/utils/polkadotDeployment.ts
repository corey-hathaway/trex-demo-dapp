import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

// Configuration constants
const POLKADOT_WS_ENDPOINT = 'ws://localhost:9944';
const DEPOSIT_LIMIT = BigInt('340282366920938463463374607431768211455');

// Validate bytecode format
function validateBytecode(bytecode: string): boolean {
  if (!bytecode || bytecode === '0x') throw new Error('Invalid bytecode: empty');
  if (!bytecode.startsWith('0x')) throw new Error('Bytecode must start with 0x');
  const cleanBytecode = bytecode.slice(2);
  if (cleanBytecode.length % 2 !== 0) throw new Error('Bytecode must have even number of hex characters');
  return true;
}

// Upload bytecode to Polkadot storage
async function uploadCodeToPolkadot(
  api: ApiPromise, 
  contractName: string, 
  bytecode: string, 
  signer: any
): Promise<string> {
  validateBytecode(bytecode);

  const reviveApi = (api.call as any).reviveApi;
  if (!reviveApi?.uploadCode) {
    throw new Error('reviveApi.uploadCode not available - ensure you are connected to a compatible Polkadot network');
  }

  console.log(`Uploading ${contractName} bytecode to Polkadot storage...`);
  console.log(`Bytecode size: ${(bytecode.length - 2) / 2} bytes`);

  const result = await reviveApi.uploadCode(
    signer.address,
    bytecode,
    DEPOSIT_LIMIT.toString()
  );

  if (result.isOk) {
    const { codeHash } = result.asOk;
    const codeHashString = codeHash.toString();
    console.log(`${contractName} bytecode uploaded successfully. Code hash: ${codeHashString}`);
    return codeHashString;
  } else {
    throw new Error(`Bytecode upload failed: ${JSON.stringify(result.asErr.toHuman())}`);
  }
}

// Create Polkadot API connection
async function createPolkadotApi(): Promise<ApiPromise> {
  const provider = new WsProvider(POLKADOT_WS_ENDPOINT);
  const api = await ApiPromise.create({ provider });
  await api.isReady;
  return api;
}

// Create Alice signer for development (has funds and permissions on test network)
function createDevelopmentSigner(): any {
  const keyring = new Keyring({ type: 'sr25519' });
  return keyring.addFromUri('//Alice');
}

// Main deployment function that combines upload + deploy
export async function deployContractViaPolkadot(
  contractName: string,
  bytecode: string,
  polkadotSigner: any,
  abi: any,
  args: any[] = []
): Promise<{
  contractAddress: string;
  codeHash: string;
  transactionHash: string;
}> {
  let api: ApiPromise | null = null;
  
  try {
    console.log(`Starting Polkadot deployment for ${contractName}...`);
    
    // Step 1: Connect to Polkadot API
    api = await createPolkadotApi();
    console.log('Connected to Polkadot API');

    console.log('Using provided signer:', polkadotSigner.address);

    // Step 2: Upload bytecode to Polkadot storage
    const codeHash = await uploadCodeToPolkadot(api, contractName, bytecode, polkadotSigner);

    // Step 3: Deploy contract using Ethereum-style deployment (but bytecode is already uploaded)
    // This part would need to be integrated with wagmi/ethers in the component
    // since we need access to the user's wallet for the actual deployment
    
    console.log(`${contractName} bytecode uploaded with hash: ${codeHash}`);
    console.log('Ready for deployment using wagmi/ethers...');

    return {
      contractAddress: '', // Will be filled by the component after wagmi deployment
      codeHash,
      transactionHash: '' // Will be filled by the component after wagmi deployment
    };

  } catch (error) {
    console.error(`Polkadot deployment error for ${contractName}:`, error);
    throw error;
  } finally {
    // Clean up API connection
    if (api) {
      await api.disconnect();
    }
  }
}

// Utility function specifically for AgentManager deployment
export async function uploadAgentManagerBytecode(bytecode: string): Promise<string> {
  let api: ApiPromise | null = null;
  
  try {
    console.log('Starting AgentManager bytecode upload...');
    
    // Connect to Polkadot API
    api = await createPolkadotApi();
    
    // Create development signer (Alice - has funds and permissions)
    const signer = createDevelopmentSigner();
    console.log('Using Alice development signer for upload:', signer.address);
    
    // Upload bytecode and return code hash
    const codeHash = await uploadCodeToPolkadot(api, 'AgentManager', bytecode, signer);
    
    return codeHash;
    
  } catch (error) {
    console.error('AgentManager bytecode upload error:', error);
    throw error;
  } finally {
    if (api) {
      await api.disconnect();
    }
  }
}

// Error types for better error handling
export class PolkadotDeploymentError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'PolkadotDeploymentError';
  }
}

export class BytecodeUploadError extends PolkadotDeploymentError {
  constructor(message: string, details?: any) {
    super(message, 'BYTECODE_UPLOAD_FAILED', details);
  }
}

export class PolkadotConnectionError extends PolkadotDeploymentError {
  constructor(message: string, details?: any) {
    super(message, 'POLKADOT_CONNECTION_FAILED', details);
  }
}
