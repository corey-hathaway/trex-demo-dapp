// API service for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Token {
  id: string;
  name: string;
  symbol: string;
  supply: string;
  decimals: number;
  address: string | null;
  formattedAddress: string;
  owner_address: string;
  status: 'pending' | 'deployed' | 'failed';
  value: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  token_id: string;
  type: 'Mint' | 'Transfer' | 'Burn';
  amount: string;
  symbol?: string;
  recipient: string;
  hash: string | null;
  formattedHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  created_at: string;
  token_name?: string;
  token_symbol?: string;
}

export interface CreateTokenRequest {
  name: string;
  symbol: string;
  supply: string;
  decimals?: number;
  owner_address: string;
}

export interface CreateTransactionRequest {
  token_id: string;
  type: 'Mint' | 'Transfer' | 'Burn';
  amount: string;
  recipient: string;
  hash?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Token endpoints
  async getTokens(): Promise<{ success: boolean; data: Token[]; count: number }> {
    return this.request('/tokens');
  }

  async getToken(id: string): Promise<{ success: boolean; data: Token }> {
    return this.request(`/tokens/${id}`);
  }

  async getTokensByOwner(ownerAddress: string): Promise<{ success: boolean; data: Token[]; count: number }> {
    return this.request(`/tokens/owner/${ownerAddress}`);
  }

  async createToken(tokenData: CreateTokenRequest): Promise<{ success: boolean; data: Token; message: string }> {
    return this.request('/tokens', {
      method: 'POST',
      body: JSON.stringify(tokenData),
    });
  }

  async updateToken(id: string, updates: Partial<Token>): Promise<{ success: boolean; data: Token; message: string }> {
    return this.request(`/tokens/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteToken(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/tokens/${id}`, {
      method: 'DELETE',
    });
  }

  async deployToken(id: string): Promise<{ success: boolean; data: Token; message: string; contractAddress: string }> {
    return this.request(`/tokens/${id}/deploy`, {
      method: 'POST',
    });
  }

  // Transaction endpoints
  async getTransactions(): Promise<{ success: boolean; data: Transaction[]; count: number }> {
    return this.request('/transactions');
  }

  async getTransaction(id: string): Promise<{ success: boolean; data: Transaction }> {
    return this.request(`/transactions/${id}`);
  }

  async getTransactionsByToken(tokenId: string): Promise<{ success: boolean; data: Transaction[]; count: number }> {
    return this.request(`/transactions/token/${tokenId}`);
  }

  async createTransaction(transactionData: CreateTransactionRequest): Promise<{ success: boolean; data: Transaction; message: string }> {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<{ success: boolean; data: Transaction; message: string }> {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTransaction(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async confirmTransaction(id: string): Promise<{ success: boolean; data: Transaction; message: string; hash: string }> {
    return this.request(`/transactions/${id}/confirm`, {
      method: 'POST',
    });
  }

  // Clear all data
  async clearAllData(): Promise<{ success: boolean; message: string }> {
    return this.request('/tokens/clear', {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.request('/health', { baseUrl: this.baseUrl.replace('/api', '') });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
