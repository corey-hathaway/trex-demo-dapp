import "./App.css";
import polkadotLogo from "./assets/polkadot-logo.svg";
import { TREXDashboard } from "./components/TREXDashboard";
import { TokenOverview } from "./components/TokenOverview";
import { TrustedIssuersDeployment } from "./components/TrustedIssuersDeployment";
import { ClaimTopicsDeployment } from "./components/ClaimTopicsDeployment";
import { IdentityStorageDeployment } from "./components/IdentityStorageDeployment";
import { IdentityRegistryDeployment } from "./components/IdentityRegistryDeployment";
import { DefaultComplianceDeployment } from "./components/DefaultComplianceDeployment";
import { TokenDeployment } from "./components/TokenDeployment";
import { AgentManagement } from "./components/AgentManagement";
import { ClaimIssuerManagement } from "./components/ClaimIssuerManagement";
import { IdentityRegistration } from "./components/IdentityRegistration";
import { ClaimTopicsManagement } from "./components/ClaimTopicsManagement";
import { IssuerTopicAuthorization } from "./components/IssuerTopicAuthorization";
import { UserSetupWizard } from "./components/UserSetupWizard";
import { TokenMinting } from "./components/TokenMinting";
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

      {/* T-REX Individual Contract Deployment (Step by Step) */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">T-REX Contract Deployment Wizard</h1>
        
        {/* Deployment Overview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Deployment Sequence Overview</h2>
          <p className="text-blue-700 mb-4 text-sm">
            Deploy T-REX contracts individually to reduce gas costs and enable better debugging. 
            Follow the sequence below to ensure proper dependencies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <p className="text-sm text-blue-800 font-medium">TrustedIssuers Registry</p>
              <p className="text-xs text-blue-600">Foundation contract</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <p className="text-sm text-purple-800 font-medium">ClaimTopics Registry</p>
              <p className="text-xs text-purple-600">Claim requirements</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <p className="text-sm text-green-800 font-medium">Identity Storage</p>
              <p className="text-xs text-green-600">Data persistence</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <p className="text-sm text-orange-800 font-medium">Identity Registry</p>
              <p className="text-xs text-orange-600">Combines 1-3</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-bold">5</span>
              </div>
              <p className="text-sm text-red-800 font-medium">Default Compliance</p>
              <p className="text-xs text-red-600">Simple rules</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">6</span>
              </div>
              <p className="text-sm text-purple-800 font-medium">Token Contract</p>
              <p className="text-xs text-purple-600">Core deployment</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <span className="text-indigo-600 font-bold">7</span>
              </div>
              <p className="text-sm text-indigo-800 font-medium">Agent Manager</p>
              <p className="text-xs text-indigo-600">Optional enhancement</p>
            </div>
          </div>
        </div>

        {/* Individual Deployment Components */}
        <TrustedIssuersDeployment />
        <ClaimTopicsDeployment />
        <IdentityStorageDeployment />
        <IdentityRegistryDeployment />
        <DefaultComplianceDeployment />
        <TokenDeployment />

        {/* Step 7: Agent Manager Deployment (Following TREXFactory.ts pattern) */}
        <AgentManagement />

        {/* Post-Deployment Configuration & Management */}
        {/* Claim Issuer Management */}
        <ClaimIssuerManagement />

        {/* Claim Topics Management */}
        <ClaimTopicsManagement />

        {/* Issuer Topic Authorization */}
        <IssuerTopicAuthorization />

        {/* User Setup Wizard */}
        <UserSetupWizard />

        {/* Token Operations */}
        {/* Token Minting */}
        <TokenMinting />

        {/* Identity Registration 
        <IdentityRegistration />
        */}

        {/* Completion Message */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
            <div className="text-green-500 text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">T-REX Infrastructure Complete!</h3>
            <p className="text-green-700 text-sm">
              Deploy contracts in sequence (Steps 1-7) following the TREXFactory.ts pattern.
              Step 7 (Agent Manager) is optional but recommended for enhanced agent management.
              Your ERC-3643 compliant T-REX token will be ready for secure transfers!
            </p>
          </div>
        </div>
      </div>

      <TokenOverview />
  {/*}
      <TREXDashboard />
  */}
    </>
  );
}

export default App;
