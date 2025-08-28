import "./App.css";
import polkadotLogo from "./assets/polkadot-logo.svg";
import { TREXDashboard } from "./components/TREXDashboard";
import WalletConnect from "./components/WalletConnect";

function App() {
  const handleWalletConnect = (address: string) => {
    console.log('Wallet connected:', address);
  };

  return (
    <>
      <img src={polkadotLogo} className="mx-auto h-52	p-4 logo" alt="Polkadot logo" />
      
      {/* Wallet Connection Component */}
      <div className="container mx-auto p-4">
        <WalletConnect onConnect={handleWalletConnect} />
      </div>

      <TREXDashboard />
    </>
  );
}

export default App;
