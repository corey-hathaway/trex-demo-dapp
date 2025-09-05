import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">T-REX Deployer</h4>
            <p className="footer-description">
              Deploy ERC-3643 compliant security tokens on Polkadot with Tokeny's regulatory framework.
            </p>
          </div>
          
          <div className="footer-section">
            <h5 className="footer-subtitle">Resources</h5>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Documentation</a></li>
              <li><a href="#" className="footer-link">T-REX Framework</a></li>
              <li><a href="#" className="footer-link">Tokeny</a></li>
              <li><a href="#" className="footer-link">Polkadot</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5 className="footer-subtitle">Support</h5>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">GitHub</a></li>
              <li><a href="#" className="footer-link">Issues</a></li>
              <li><a href="#" className="footer-link">Discord</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5 className="footer-subtitle">Legal</h5>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">License</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 T-REX Demo dApp. Built with ❤️ for the Polkadot ecosystem.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
