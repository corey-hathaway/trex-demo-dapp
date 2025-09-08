import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { NETWORK_CONFIG, CONTRACT_CONFIG } from '../shared/config';
import { logger } from '../utils/logger';

// Define custom chain for Asset Hub
const assetHubChain = {
  id: NETWORK_CONFIG.chainId,
  name: NETWORK_CONFIG.name,
  network: 'assethub',
  nativeCurrency: {
    decimals: 18,
    name: 'DOT',
    symbol: 'DOT',
  },
  rpcUrls: {
    default: {
      http: [NETWORK_CONFIG.rpcUrl],
    },
    public: {
      http: [NETWORK_CONFIG.rpcUrl],
    },
  },
} as const;

class BlockchainService {
  public walletClient: any;
  public publicClient: any;
  public account: any;

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    try {
      // Get private key from environment
      const privateKey = process.env.PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('PRIVATE_KEY environment variable is required');
      }

      // Create account from private key
      this.account = privateKeyToAccount(privateKey as `0x${string}`);

      // Create wallet client for transactions
      this.walletClient = createWalletClient({
        account: this.account,
        chain: assetHubChain,
        transport: http(NETWORK_CONFIG.rpcUrl)
      });

      // Create public client for reading
      this.publicClient = createPublicClient({
        chain: assetHubChain,
        transport: http(NETWORK_CONFIG.rpcUrl)
      });

      logger.info('Blockchain service initialized', {
        chainId: NETWORK_CONFIG.chainId,
        rpcUrl: NETWORK_CONFIG.rpcUrl,
        account: this.account.address
      });

    } catch (error) {
      logger.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  /**
   * Get the service account address
   */
  getServiceAccount(): string {
    return this.account.address;
  }

  /**
   * Get wallet client for transactions
   */
  getWalletClient() {
    return this.walletClient;
  }

  /**
   * Get public client for reading
   */
  getPublicClient() {
    return this.publicClient;
  }

  /**
   * Check if blockchain connection is healthy
   */
  async checkHealth(): Promise<{ connected: boolean; blockNumber?: string; account: string }> {
    try {
      const blockNumber = await this.publicClient.getBlockNumber();
      return {
        connected: true,
        blockNumber: blockNumber.toString(),
        account: this.account.address
      };
    } catch (error) {
      logger.error('Blockchain health check failed:', error);
      return {
        connected: false,
        account: this.account.address
      };
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.publicClient.getBalance({
        address: address as `0x${string}`
      });
      return formatEther(balance);
    } catch (error) {
      logger.error(`Failed to get balance for ${address}:`, error);
      throw error;
    }
  }

  /**
   * Wait for transaction receipt with timeout
   */
  async waitForTransaction(hash: string, timeout: number = CONTRACT_CONFIG.timeout): Promise<any> {
    try {
      logger.debug(`Waiting for transaction ${hash}`);
      
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
        timeout
      });

      logger.debug(`Transaction ${hash} confirmed in block ${receipt.blockNumber}`);
      return receipt;
    } catch (error) {
      logger.error(`Failed to wait for transaction ${hash}:`, error);
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(to: string, data: string, value: bigint = 0n): Promise<bigint> {
    try {
      const gas = await this.publicClient.estimateGas({
        account: this.account,
        to: to as `0x${string}`,
        data: data as `0x${string}`,
        value
      });
      return gas;
    } catch (error) {
      logger.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  /**
   * Send a raw transaction
   */
  async sendTransaction(to: string, data: string, value: bigint = 0n): Promise<string> {
    try {
      const hash = await this.walletClient.sendTransaction({
        to: to as `0x${string}`,
        data: data as `0x${string}`,
        value,
        gas: BigInt(CONTRACT_CONFIG.gasLimit)
      });

      logger.debug(`Transaction sent: ${hash}`);
      return hash;
    } catch (error) {
      logger.error('Failed to send transaction:', error);
      throw error;
    }
  }

  /**
   * Deploy a contract
   */
  async deployContract(bytecode: string, abi: any[], args: any[] = []): Promise<{ address: string; transactionHash: string }> {
    try {
      logger.debug('Deploying contract with bytecode length:', bytecode.length);

      // For large PVM contracts, use MASSIVE gas limits to override fee calculation
      const bytecodeSize = bytecode.length / 2;
      let gasLimit: bigint;
      
      if (bytecodeSize > 10000) {
        // Use extremely high gas limit based on node debug logs showing 158+ trillion needed
        gasLimit = BigInt('200000000000000'); // 200 trillion - higher than observed 158 trillion
        logger.info(`Large PVM contract detected (${bytecodeSize} bytes), using massive gas override: ${gasLimit.toString()}`);
      } else {
        gasLimit = BigInt(CONTRACT_CONFIG.gasLimit);
      }

      logger.debug('Using gas limit:', gasLimit.toString());

      // For large PVM contracts, override gas price based on debug logs
      let deployArgs: any = {
        abi,
        bytecode: bytecode as `0x${string}`,
        args,
        gas: gasLimit
      };
      
      if (bytecodeSize > 10000) {
        // Debug logs show actual fees needed: ~158+ trillion total
        // For demo purposes, set a massive gas price that can cover the actual fees
        // Since gasLimit is 200 trillion, we need gasPrice = actualFees / gasLimit
        // 159 trillion / 200 trillion = 0.795, so we need at least 1 gwei base
        const massiveGasPrice = BigInt('1000000000000000'); // 1,000 trillion gwei (massive for demo)
        deployArgs.gasPrice = massiveGasPrice;
        logger.info(`Large PVM contract: using massive demo gas price: ${massiveGasPrice.toString()} gwei`);
        logger.info(`Total estimated cost: ${(gasLimit * massiveGasPrice).toString()} wei`);
      }

      const hash = await this.walletClient.deployContract(deployArgs);

      logger.debug(`Contract deployment transaction sent: ${hash}`);

      // Wait for receipt to get contract address
      const receipt = await this.waitForTransaction(hash);

      if (!receipt.contractAddress) {
        throw new Error('Contract deployment failed - no contract address in receipt');
      }

      logger.info(`Contract deployed successfully`, {
        address: receipt.contractAddress,
        transactionHash: hash,
        blockNumber: receipt.blockNumber
      });

      return {
        address: receipt.contractAddress,
        transactionHash: hash
      };

    } catch (error) {
      logger.error('Contract deployment failed:', error);
      throw error;
    }
  }

  /**
   * Call a contract method (read-only)
   */
  async readContract(address: string, abi: any[], functionName: string, args: any[] = []): Promise<any> {
    try {
      const result = await this.publicClient.readContract({
        address: address as `0x${string}`,
        abi,
        functionName,
        args
      });
      return result;
    } catch (error) {
      logger.error(`Failed to read contract ${address}.${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Write to a contract (transaction)
   */
  async writeContract(address: string, abi: any[], functionName: string, args: any[] = []): Promise<string> {
    try {
      const hash = await this.walletClient.writeContract({
        address: address as `0x${string}`,
        abi,
        functionName,
        args,
        gas: BigInt(CONTRACT_CONFIG.gasLimit)
      });

      logger.debug(`Contract write transaction sent: ${hash}`, {
        address,
        functionName,
        args
      });

      return hash;
    } catch (error) {
      logger.error(`Failed to write contract ${address}.${functionName}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
let _blockchainService: BlockchainService | null = null;

export const getBlockchainService = (): BlockchainService => {
  if (!_blockchainService) {
    _blockchainService = new BlockchainService();
  }
  return _blockchainService;
};

// For backward compatibility
export const blockchainService = {
  get walletClient() { return getBlockchainService().walletClient; },
  get publicClient() { return getBlockchainService().publicClient; },
  get account() { return getBlockchainService().account; },
  deployContract: (bytecode: string, abi: any[], args: any[] = []) => getBlockchainService().deployContract(bytecode, abi, args),
  writeContract: (address: string, abi: any, functionName: string, args: any[] = []) => getBlockchainService().writeContract(address, abi, functionName, args),
  readContract: (address: string, abi: any, functionName: string, args: any[] = []) => getBlockchainService().readContract(address, abi, functionName, args),
  waitForTransaction: (hash: string, timeout?: number) => getBlockchainService().waitForTransaction(hash, timeout),
  getBalance: (address: string) => getBlockchainService().getBalance(address),
  estimateGas: (to: string, data: string, value?: bigint) => getBlockchainService().estimateGas(to, data, value),
  getServiceAccount: () => getBlockchainService().getServiceAccount(),
  checkHealth: () => getBlockchainService().checkHealth(),
};
