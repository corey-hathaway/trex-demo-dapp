import "./App.css";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { Footer } from "./components/Footer";
import { NewHomepage } from "./components/NewHomepage";
import { useState } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard'>('home');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);

  const handlePageChange = (page: 'home' | 'dashboard') => {
    setCurrentPage(page);
  };

  const handleWalletConnect = (address: string, accountName: string, session: any) => {
    console.log('App - Wallet connected:', { address, accountName, session: !!session });
    setWalletAddress(address);
    setWalletName(accountName);
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    setWalletName(null);
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        walletAddress={walletAddress}
        walletName={walletName}
        onWalletConnect={handleWalletConnect}
        onWalletDisconnect={handleWalletDisconnect}
      />
      
      {/* Page Content */}
      {currentPage === 'home' && <NewHomepage walletAddress={walletAddress} />}

      {currentPage === 'dashboard' && (
        <div className="container mx-auto px-6 py-8">
          <Dashboard walletAddress={walletAddress} />
        </div>
      )}
      
      {/* T-REX Deployer Section */}
      <div className="trex-deployer-section">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h4 className="trex-deployer-title">T-REX Deployer</h4>
            <p className="trex-deployer-description">
              Deploy ERC-3643 compliant security tokens on Polkadot with Tokeny's regulatory framework.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
