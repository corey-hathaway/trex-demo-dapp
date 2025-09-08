import React, { useState } from 'react';
import { usePolkadotAuth } from '@polkadot-auth/ui';
import WalletSelector from './WalletSelector';

const DeploymentWizard = () => {
  const { isConnected, address } = usePolkadotAuth();
  const [currentStep, setCurrentStep] = useState(1);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Deploy T-REX Contracts</h2>
        <p className="text-gray-400 mb-8">
          Connect your wallet to start deploying ERC-3643 compliant tokens
        </p>
        <WalletSelector />
      </div>
    );
  }

  const steps = [
    'TrustedIssuers Registry',
    'ClaimTopics Registry',
    'Identity Storage',
    'Identity Registry',
    'Default Compliance',
    'Token Contract'
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">T-REX Deployment Wizard</h2>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{Math.round((currentStep / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">
          Step {currentStep}: {steps[currentStep - 1]}
        </h3>
        <p className="text-gray-300 mb-4">
          Deploying from wallet: <span className="font-mono text-blue-400">{address}</span>
        </p>

        {/* Your existing deployment logic here */}
        <div className="space-y-4">
          <p className="text-gray-400">
            Contract deployment logic for {steps[currentStep - 1]}...
          </p>

          <div className="flex space-x-4">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
              >
                Previous
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={() => alert('Deployment Complete!')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                Complete Deployment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentWizard;
