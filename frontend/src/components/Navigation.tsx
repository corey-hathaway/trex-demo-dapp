import React from 'react';

interface NavigationProps {
  currentPage: 'home' | 'dashboard';
  onPageChange: (page: 'home' | 'dashboard') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => onPageChange('home')}>
          <span className="brand-text">TokenyDemoDApp</span>
        </div>
        
        <div className="nav-menu">
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
