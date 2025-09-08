// Backend-specific API types

import { ApiResponse } from '../shared/types';

export interface ErrorResponse extends ApiResponse {
  success: false;
  error: string;
}

export interface SuccessResponse<T = any> extends ApiResponse {
  success: true;
  data: T;
}

export type ApiEndpointResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Internal deployment tracking
export interface DeploymentJob {
  id: string;
  status: 'pending' | 'deploying' | 'complete' | 'error';
  request: {
    tokenName: string;
    tokenSymbol: string;
    decimals: number;
  };
  result?: {
    contracts: any;
    transactionHashes: string[];
  };
  currentStep?: string;
  progress?: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}
