import React, { useState, useEffect } from 'react';
import { trexDeploymentService } from '../services/trexDeployment';

interface NetworkInfo {
  chainId: number;
  blockNumber: string;
  networkName: string;
  rpcUrl: string;
}

export const NetworkStatus: React.FC = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check network connection
        const info = await trexDeploymentService.getNetworkInfo();
        if (info) {
          setNetworkInfo(info);
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Failed to check network status:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkNetworkStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkNetworkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span>Connecting to Paseo Testnet...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
        {isConnected ? 'Connected to Paseo Testnet' : 'Disconnected from Paseo Testnet'}
      </span>
      {networkInfo && (
        <span className="text-gray-400">
          (Block: {networkInfo.blockNumber})
        </span>
      )}
    </div>
  );
};
