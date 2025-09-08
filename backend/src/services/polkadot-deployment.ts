/**
 * Polkadot PVM Deployment Service
 * 
 * OVERVIEW:
 * Implements hybrid deployment approach that matches T-REX's exact methodology:
 * 1. Upload contract bytecode to Polkadot PVM for optimization/reference
 * 2. Deploy contracts via Ethereum compatibility layer using Viem
 * 
 * CURRENT STATUS:
 * ✅ PVM code upload: Working perfectly (returns valid code hashes)
 * ❌ Ethereum deployment: Fails for large contracts (15KB+) with "Invalid Transaction"
 * 
 * KNOWN LIMITATIONS:
 * - Large PVM-compiled contracts exceed Ethereum layer transaction limits
 * - This affects both our implementation and T-REX's original approach
 * - Smaller contracts may work, large T-REX contracts currently cannot deploy
 * 
 * NEXT STEPS FOR FUTURE DEVELOPERS:
 * - Test with smaller contracts to verify Ethereum layer works for those
 * - Investigate Polkadot PVM improvements for large contract support
 * - Consider pure PVM deployment path (bypass Ethereum layer entirely)
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { POLKADOT_CONFIG } from '../shared/constants';
import { blockchainService } from './blockchain';
import { logger } from '../utils/logger';

// Use reasonable limits that fit in u64 (max value: 18,446,744,073,709,551,615)
const GAS_LIMIT = '10000000000000'; // 10 trillion - reasonable gas limit
const PROOF_SIZE_LIMIT = '1000000'; // 1 million - reasonable proof size
const STORAGE_DEPOSIT_LIMIT = '340282366920938463463374607431768211455'; // Same as T-REX script

interface ContractDeploymentResult {
  address: string;
  codeHash: string;
  transactionHash: string;
}

class PolkadotDeploymentService {
  private polkadotApi?: ApiPromise;
  private polkadotSigner?: any;

  constructor() {
    this.initializePolkadot();
  }

  private async initializePolkadot() {
    try {
      // Initialize Polkadot API
      const wsProvider = new WsProvider(POLKADOT_CONFIG.wsUrl);
      this.polkadotApi = await ApiPromise.create({ provider: wsProvider });

      // Create development signer (Alice)
      const keyring = new Keyring({ type: 'sr25519' });
      this.polkadotSigner = keyring.addFromUri('//Alice');

      logger.info('Polkadot deployment service initialized');
    } catch (error) {
      logger.error('Failed to initialize Polkadot deployment service:', error);
    }
  }

  /**
   * Validate bytecode format
   */
  private validateBytecode(bytecode: string): boolean {
    if (!bytecode || bytecode === '0x') throw new Error('Invalid bytecode: empty');
    if (!bytecode.startsWith('0x')) throw new Error('Bytecode must start with 0x');
    const cleanBytecode = bytecode.slice(2);
    if (cleanBytecode.length % 2 !== 0) throw new Error('Bytecode must have even number of hex characters');
    return true;
  }

  /**
   * Convert hex string to Uint8Array for PVM
   */
  private hexToBytes(hex: string): Uint8Array {
    const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
  }

  /**
   * Upload bytecode to Polkadot using reviveApi
   */
  async uploadCode(contractName: string, bytecode: string): Promise<string> {
    if (!this.polkadotApi || !this.polkadotSigner) {
      throw new Error('Polkadot API not initialized');
    }

    this.validateBytecode(bytecode);

    const reviveApi = (this.polkadotApi.call as any).reviveApi;
    if (!reviveApi?.uploadCode) {
      throw new Error('reviveApi.uploadCode not available');
    }

    logger.info(`Uploading bytecode for ${contractName}`, { 
      bytecodeLength: bytecode.length,
      signer: this.polkadotSigner.address 
    });

    // T-REX script passes bytecode as string, not bytes
    const result = await reviveApi.uploadCode(
      this.polkadotSigner.address,
      bytecode,
      STORAGE_DEPOSIT_LIMIT
    );

    if (result.isOk) {
      const { codeHash } = result.asOk;
      const codeHashStr = codeHash.toString();
      logger.info(`${contractName} bytecode uploaded successfully`, { 
        codeHash: codeHashStr 
      });
      return codeHashStr;
    } else {
      const error = result.asErr.toHuman();
      logger.error(`Upload failed for ${contractName}:`, error);
      throw new Error(`Upload failed for ${contractName}: ${JSON.stringify(error)}`);
    }
  }

  /**
   * Instantiate contract using uploaded code hash
   */
  async instantiateContract(
    contractName: string,
    codeHash: string,
    constructorArgs: any[] = [],
    value: bigint = 0n
  ): Promise<ContractDeploymentResult> {
    if (!this.polkadotApi || !this.polkadotSigner) {
      throw new Error('Polkadot API not initialized');
    }

    logger.info(`Instantiating contract ${contractName}`, {
      codeHash,
      constructorArgs: constructorArgs.length,
      value: value.toString()
    });

    try {
      // Use reviveApi to instantiate the contract
      const reviveApi = (this.polkadotApi.call as any).reviveApi;
      if (!reviveApi?.instantiate) {
        throw new Error('reviveApi.instantiate not available');
      }

      // Encode constructor arguments (for now, we'll use empty data if no args)
      const constructorData = constructorArgs.length > 0 
        ? this.encodeConstructorArgs(constructorArgs)
        : '0x';

      // Generate a salt for address derivation (can be random or deterministic)
      const salt = '0x0000000000000000000000000000000000000000000000000000000000000000';

      // ReviveApi.instantiate expects 7 arguments:
      // 1. origin (caller address)
      // 2. value (amount to transfer)
      // 3. gas_limit (gas limit for the call - should be Weight object)
      // 4. storage_deposit_limit (storage deposit limit)
      // 5. code_hash (hash of uploaded code)
      // 6. data (constructor arguments)
      // 7. salt (for address derivation)
      
      // Create proper Weight object for gas limit
      const gasLimit = {
        refTime: GAS_LIMIT,
        proofSize: PROOF_SIZE_LIMIT
      };

      const result = await reviveApi.instantiate(
        this.polkadotSigner.address,  // origin
        value.toString(),             // value
        gasLimit,                     // gas_limit (Weight object)
        STORAGE_DEPOSIT_LIMIT,        // storage_deposit_limit
        codeHash,                     // code_hash
        constructorData,              // data
        salt                          // salt
      );

      if (result.isOk) {
        const { address } = result.asOk;
        const contractAddress = address.toString();
        
        logger.info(`${contractName} instantiated successfully`, {
          address: contractAddress,
          codeHash
        });

        return {
          address: contractAddress,
          codeHash,
          transactionHash: 'polkadot-instantiation' // Polkadot doesn't use Ethereum-style tx hashes
        };
      } else {
        const error = result.asErr.toHuman();
        logger.error(`Instantiation failed for ${contractName}:`, error);
        throw new Error(`Instantiation failed for ${contractName}: ${JSON.stringify(error)}`);
      }
    } catch (error) {
      logger.error(`Contract instantiation failed for ${contractName}:`, error);
      throw error;
    }
  }

  /**
   * Deploy contract using hybrid approach: PVM upload + Ethereum deployment (like T-REX)
   */
  async deployContract(
    contractName: string,
    bytecode: string,
    abi: any[],
    constructorArgs: any[] = []
  ): Promise<ContractDeploymentResult> {
    logger.info(`Starting hybrid deployment for ${contractName}`);

    try {
      // Step 1: Upload bytecode to PVM (optional, for optimization/reference)
      const codeHash = await this.uploadCode(contractName, bytecode);

      // Step 2: Deploy via Ethereum compatibility layer (like T-REX does)
      const result = await blockchainService.deployContract(
        bytecode,
        abi,
        constructorArgs
      );

      logger.info(`${contractName} deployed successfully via hybrid approach`, {
        address: result.address,
        codeHash: codeHash,
        transactionHash: result.transactionHash
      });

      return {
        address: result.address,
        codeHash: codeHash,
        transactionHash: result.transactionHash
      };
    } catch (error) {
      logger.error(`Hybrid deployment failed for ${contractName}:`, error);
      throw error;
    }
  }

  /**
   * Encode constructor arguments (simplified version)
   * TODO: Implement proper ABI encoding for constructor args
   */
  private encodeConstructorArgs(args: any[]): string {
    // For now, return empty data - we'll need to implement proper ABI encoding
    // This is a placeholder that can be enhanced later
    logger.warn('Constructor argument encoding not yet implemented, using empty data');
    return '0x';
  }

  /**
   * Check if the service is ready
   */
  isReady(): boolean {
    return !!(this.polkadotApi && this.polkadotSigner);
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      connected: this.isReady(),
      signer: this.polkadotSigner?.address || null,
      apiReady: !!this.polkadotApi
    };
  }
}

// Export singleton instance
export const polkadotDeploymentService = new PolkadotDeploymentService();
