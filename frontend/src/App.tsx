import "./App.css";
import polkadotLogo from "./assets/polkadot-logo.svg";
import { Navigation } from "./components/Navigation";
import { DeploymentWizard } from "./components/DeploymentWizard";
import { Dashboard } from "./components/Dashboard";
import { Footer } from "./components/Footer";
import WalletConnect from "./components/WalletConnect";
import { useState } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'deployment' | 'dashboard'>('home');
  
  const handleWalletConnect = (address: string) => {
    console.log('Wallet connected:', address);
  };

  const handlePageChange = (page: 'home' | 'deployment' | 'dashboard') => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      {/* Page Content */}
      {currentPage === 'home' && (
        <>
          {/* Hero Section */}
          <section className="hero-section">
            <img src={polkadotLogo} className="logo mx-auto h-32 p-4" alt="Polkadot logo" />
            <h1 className="hero-title">T-REX Contract Deployment</h1>
            <p className="hero-subtitle">
              Deploy ERC-3643 compliant security tokens on Polkadot with Tokeny's regulatory framework
            </p>
            
            {/* Wallet Connection Component */}
            <div className="container mx-auto p-4">
              <WalletConnect onConnect={handleWalletConnect} />
            </div>
          </section>

          {/* Main Content */}
          <div className="container mx-auto px-6">
            {/* Deployment Overview */}
            <section className="modern-card">
              <h2 className="section-title">Deployment Sequence</h2>
              <p className="section-subtitle">
                Deploy T-REX contracts individually to reduce gas costs and enable better debugging. 
                Follow the sequence below to ensure proper dependencies.
              </p>
              
              <div className="deployment-steps">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h3 className="mb-2 text-lg font-semibold">TrustedIssuers Registry</h3>
                  <p className="text-secondary-text text-sm">Foundation contract for managing trusted claim issuers</p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h3 className="mb-2 text-lg font-semibold">ClaimTopics Registry</h3>
                  <p className="text-secondary-text text-sm">Manages claim topic requirements for compliance</p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h3 className="mb-2 text-lg font-semibold">Identity Storage</h3>
                  <p className="text-secondary-text text-sm">Persistent storage for identity verification data</p>
                </div>
                <div className="step-card">
                  <div className="step-number">4</div>
                  <h3 className="mb-2 text-lg font-semibold">Identity Registry</h3>
                  <p className="text-secondary-text text-sm">Combines all identity management components</p>
                </div>
                <div className="step-card">
                  <div className="step-number">5</div>
                  <h3 className="mb-2 text-lg font-semibold">Default Compliance</h3>
                  <p className="text-secondary-text text-sm">Simple compliance rules for your token</p>
                </div>
                <div className="step-card">
                  <div className="step-number">6</div>
                  <h3 className="mb-2 text-lg font-semibold">Token Contract</h3>
                  <p className="text-secondary-text text-sm">Final ERC-3643 compliant token deployment</p>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="modern-card">
              <div className="text-center">
                <h2 className="section-title">Get Started</h2>
                <p className="section-subtitle mb-6">
                  Choose your next step to begin deploying T-REX contracts
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    className="btn-primary"
                    onClick={() => handlePageChange('deployment')}
                  >
                    Start Deployment
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => handlePageChange('dashboard')}
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {currentPage === 'deployment' && (
        <div className="container mx-auto px-6 py-8">
          <DeploymentWizard />
        </div>
      )}

      {currentPage === 'dashboard' && (
        <div className="container mx-auto px-6 py-8">
          <Dashboard />
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
