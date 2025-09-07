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
      {currentPage === 'home' && <NewHomepage />}

      {currentPage === 'dashboard' && (
        <div className="container mx-auto px-6 py-8">
          <Dashboard walletAddress={walletAddress} />
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
