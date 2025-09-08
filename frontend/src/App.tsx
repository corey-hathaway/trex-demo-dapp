import React from 'react';
import { PolkadotAuthProvider } from '@polkadot-auth/ui';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DeploymentWizard from './components/DeploymentWizard';
import './App.css';

function App() {
  return (
    <PolkadotAuthProvider
      domain="trex-demo-dapp.com"
      uri="https://trex-demo-dapp.com"
      defaultChain="polkadot"
    >
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Dashboard />
          <DeploymentWizard />
        </main>
      </div>
    </PolkadotAuthProvider>
  );
}

export default App;
