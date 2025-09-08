import { TokenInfo, BalanceInfo } from '../shared/types';
import { CONTRACT_NAMES } from '../shared/constants';
import { blockchainService } from './blockchain';
import { artifactsLoader } from '../utils/artifacts';
import { logger } from '../utils/logger';

class ContractsService {
  
  /**
   * Mint tokens to a specific address
   */
  async mintTokens(tokenAddress: string, to: string, amount: string): Promise<{ transactionHash: string }> {
    try {
      logger.info(`Minting ${amount} tokens to ${to}`, { tokenAddress });

      // Get token ABI
      const tokenAbi = artifactsLoader.getAbi(CONTRACT_NAMES.TOKEN);

      // Convert amount to proper format (assuming 0 decimals for T-REX demo)
      const amountBigInt = BigInt(amount);

      // Call mint function
      const transactionHash = await blockchainService.writeContract(
        tokenAddress,
        tokenAbi,
        'mint',
        [to, amountBigInt]
      );

      // Wait for transaction confirmation
      await blockchainService.waitForTransaction(transactionHash);

      logger.info(`Tokens minted successfully`, { 
        transactionHash, 
        tokenAddress, 
        to, 
        amount 
      });

      return { transactionHash };

    } catch (error) {
      logger.error('Failed to mint tokens:', error);
      throw new Error(`Mint failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transfer tokens between addresses
   */
  async transferTokens(tokenAddress: string, from: string, to: string, amount: string): Promise<{ transactionHash: string }> {
    try {
      logger.info(`Transferring ${amount} tokens from ${from} to ${to}`, { tokenAddress });

      // Get token ABI
      const tokenAbi = artifactsLoader.getAbi(CONTRACT_NAMES.TOKEN);

      // Convert amount to proper format
      const amountBigInt = BigInt(amount);

      // For T-REX tokens, we need to use transferFrom as the service account
      // First check if we need to approve (in a real implementation)
      
      // Call transferFrom function (service account acts as spender)
      const transactionHash = await blockchainService.writeContract(
        tokenAddress,
        tokenAbi,
        'transferFrom',
        [from, to, amountBigInt]
      );

      // Wait for transaction confirmation
      await blockchainService.waitForTransaction(transactionHash);

      logger.info(`Tokens transferred successfully`, { 
        transactionHash, 
        tokenAddress, 
        from, 
        to, 
        amount 
      });

      return { transactionHash };

    } catch (error) {
      logger.error('Failed to transfer tokens:', error);
      throw new Error(`Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get token information
   */
  async getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
    try {
      logger.debug(`Getting token info for ${tokenAddress}`);

      // Get token ABI
      const tokenAbi = artifactsLoader.getAbi(CONTRACT_NAMES.TOKEN);

      // Read token information in parallel
      const [name, symbol, decimals, totalSupply, paused, owner] = await Promise.all([
        blockchainService.readContract(tokenAddress, tokenAbi, 'name'),
        blockchainService.readContract(tokenAddress, tokenAbi, 'symbol'),
        blockchainService.readContract(tokenAddress, tokenAbi, 'decimals'),
        blockchainService.readContract(tokenAddress, tokenAbi, 'totalSupply'),
        blockchainService.readContract(tokenAddress, tokenAbi, 'paused'),
        blockchainService.readContract(tokenAddress, tokenAbi, 'owner')
      ]);

      const tokenInfo: TokenInfo = {
        name: name as string,
        symbol: symbol as string,
        decimals: Number(decimals),
        totalSupply: (totalSupply as bigint).toString(),
        paused: paused as boolean,
        owner: owner as string,
        contractAddress: tokenAddress
      };

      logger.debug(`Token info retrieved`, tokenInfo);
      return tokenInfo;

    } catch (error) {
      logger.error(`Failed to get token info for ${tokenAddress}:`, error);
      throw new Error(`Failed to get token info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get balance information for a user
   */
  async getBalanceInfo(tokenAddress: string, userAddress: string): Promise<BalanceInfo> {
    try {
      logger.debug(`Getting balance for ${userAddress} on token ${tokenAddress}`);

      // Get token ABI
      const tokenAbi = artifactsLoader.getAbi(CONTRACT_NAMES.TOKEN);

      // Read balance and frozen status
      const [balance, frozen] = await Promise.all([
        blockchainService.readContract(tokenAddress, tokenAbi, 'balanceOf', [userAddress]),
        blockchainService.readContract(tokenAddress, tokenAbi, 'isFrozen', [userAddress])
          .catch(() => false) // isFrozen might not exist in all token implementations
      ]);

      const balanceInfo: BalanceInfo = {
        balance: (balance as bigint).toString(),
        frozen: frozen as boolean
      };

      logger.debug(`Balance info retrieved`, { userAddress, tokenAddress, ...balanceInfo });
      return balanceInfo;

    } catch (error) {
      logger.error(`Failed to get balance for ${userAddress} on ${tokenAddress}:`, error);
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if token is paused
   */
  async isTokenPaused(tokenAddress: string): Promise<boolean> {
    try {
      const tokenAbi = artifactsLoader.getAbi(CONTRACT_NAMES.TOKEN);
      const paused = await blockchainService.readContract(tokenAddress, tokenAbi, 'paused');
      return paused as boolean;
    } catch (error) {
      logger.error(`Failed to check if token is paused: ${tokenAddress}:`, error);
      return false;
    }
  }

  /**
   * Unpause token (useful for enabling transfers)
   */
  async unpauseToken(tokenAddress: string): Promise<{ transactionHash: string }> {
    try {
      logger.info(`Unpausing token ${tokenAddress}`);

      const tokenAbi = artifactsLoader.getAbi(CONTRACT_NAMES.TOKEN);
      
      const transactionHash = await blockchainService.writeContract(
        tokenAddress,
        tokenAbi,
        'unpause',
        []
      );

      await blockchainService.waitForTransaction(transactionHash);

      logger.info(`Token unpaused successfully`, { transactionHash, tokenAddress });
      return { transactionHash };

    } catch (error) {
      logger.error(`Failed to unpause token ${tokenAddress}:`, error);
      throw new Error(`Unpause failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if an address is an agent
   */
  async isAgent(tokenAddress: string, address: string): Promise<boolean> {
    try {
      const tokenAbi = artifactsLoader.getAbi(CONTRACT_NAMES.TOKEN);
      const isAgent = await blockchainService.readContract(tokenAddress, tokenAbi, 'isAgent', [address]);
      return isAgent as boolean;
    } catch (error) {
      logger.error(`Failed to check agent status for ${address}:`, error);
      return false;
    }
  }

  /**
   * Add an agent to the token
   */
  async addAgent(tokenAddress: string, agentAddress: string): Promise<{ transactionHash: string }> {
    try {
      logger.info(`Adding agent ${agentAddress} to token ${tokenAddress}`);

      const tokenAbi = artifactsLoader.getAbi(CONTRACT_NAMES.TOKEN);
      
      const transactionHash = await blockchainService.writeContract(
        tokenAddress,
        tokenAbi,
        'addAgent',
        [agentAddress]
      );

      await blockchainService.waitForTransaction(transactionHash);

      logger.info(`Agent added successfully`, { transactionHash, tokenAddress, agentAddress });
      return { transactionHash };

    } catch (error) {
      logger.error(`Failed to add agent ${agentAddress} to ${tokenAddress}:`, error);
      throw new Error(`Add agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Health check for blockchain connection
   */
  async checkHealth(): Promise<{ 
    connected: boolean; 
    blockNumber?: string; 
    account: string;
    artifactsLoaded: number;
  }> {
    try {
      const blockchainHealth = await blockchainService.checkHealth();
      
      return {
        ...blockchainHealth,
        artifactsLoaded: Object.keys(artifactsLoader['artifactCache'] || {}).length
      };
    } catch (error) {
      logger.error('Health check failed:', error);
      return {
        connected: false,
        account: blockchainService.getServiceAccount(),
        artifactsLoaded: 0
      };
    }
  }
}

// Export singleton instance
export const contractsService = new ContractsService();
