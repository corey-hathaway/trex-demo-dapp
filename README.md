# T-REX Demo dApp

A modern web3 application for deploying ERC-3643 compliant security tokens on Polkadot using Tokeny's T-REX (Tokeny's Regulatory EXchange) framework.

## 🚀 Features

- **Multi-Step Deployment Wizard**: Guided step-by-step contract deployment process
- **Asset Dashboard**: View and manage deployed token details and statistics
- **Modern UI**: Dark theme inspired by DeployPolkadot.xyz with responsive design
- **Wallet Integration**: Connect with Web3 wallets for contract deployment
- **T-REX Framework**: Full support for Tokeny's regulatory compliance infrastructure

## 🏗️ Architecture

The application deploys 6 core T-REX contracts in sequence:

1. **TrustedIssuers Registry** - Foundation contract for managing trusted claim issuers
2. **ClaimTopics Registry** - Manages claim topic requirements for compliance
3. **Identity Storage** - Persistent storage for identity verification data
4. **Identity Registry** - Combines all identity management components
5. **Default Compliance** - Simple compliance rules for your token
6. **Token Contract** - Final ERC-3643 compliant token deployment

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS
- **Web3**: Wagmi + Viem for blockchain interactions
- **Blockchain**: Polkadot AssetHub (Chain ID: 420420420)
- **Framework**: T-REX (Tokeny's Regulatory EXchange)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Web3 wallet (MetaMask, Polkadot.js, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/corey-hathaway/trex-demo-dapp.git
cd trex-demo-dapp
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📱 Usage

1. **Connect Wallet**: Use the wallet connection component to link your Web3 wallet
2. **Deploy Contracts**: Navigate to "Deploy Contracts" to start the step-by-step wizard
3. **Monitor Assets**: Use the "Asset Dashboard" to view deployed token details and statistics

## 🎨 UI Components

- **Navigation**: Clean top navigation with brand logo and menu items
- **Deployment Wizard**: Multi-step process with progress tracking
- **Dashboard**: Asset overview with contract details and statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run generate` - Generate Wagmi contract hooks

### Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Asset dashboard
│   │   ├── DeploymentWizard.tsx # Multi-step deployment
│   │   ├── Navigation.tsx   # Top navigation
│   │   └── ...             # Deployment components
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application
│   └── App.css             # Global styles
├── T-REX/                  # Contract artifacts
└── package.json
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for the Polkadot ecosystem
