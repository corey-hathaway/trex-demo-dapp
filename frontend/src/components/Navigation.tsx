import React from 'react';

interface NavigationProps {
  currentPage: 'home' | 'deployment' | 'dashboard';
  onPageChange: (page: 'home' | 'deployment' | 'dashboard') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-icon">🚀</span>
          <span className="brand-text">T-REX Deployer</span>
        </div>
        
        <div className="nav-menu">
          <button
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onPageChange('home')}
          >
            Home
          </button>
          <button
            className={`nav-item ${currentPage === 'deployment' ? 'active' : ''}`}
            onClick={() => onPageChange('deployment')}
          >
            Deploy Contracts
          </button>
          <button
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => onPageChange('dashboard')}
          >
            Asset Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
};
