import React, { useState } from 'react';
import { Modal } from './Modal';

interface Transaction {
  type: string;
  amount: string;
  symbol: string;
  recipient: string;
  timestamp: string;
  hash: string;
}

interface TransactionsSectionProps {
  transactions?: Transaction[];
  onViewAll?: () => void;
}

export const TransactionsSection: React.FC<TransactionsSectionProps> = ({ 
  transactions = [], 
  onViewAll 
}) => {
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  
  console.log('TransactionsSection - transactions received:', transactions);
  console.log('TransactionsSection - transactions.length:', transactions.length);

  const handleViewAll = () => {
    setShowViewAllModal(true);
  };

  return (
    <div className="homepage-section">
      <h3 className="section-header">Transactions</h3>
      
      <div className="transactions-list">
        {transactions.length > 0 ? (
          transactions.map((tx, index) => (
            <div key={index} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-details">
                  {tx.type} {tx.amount} {tx.symbol} → {tx.recipient}
                </div>
                <div className="transaction-timestamp">
                  {tx.timestamp}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-transactions-message">
            <p>No transactions found. Your transaction history will appear here!</p>
          </div>
        )}
      </div>
      
      <button
        onClick={handleViewAll}
        className="btn-secondary view-all-btn"
      >
        View All
      </button>

      {/* View All Transactions Modal */}
      <Modal
        isOpen={showViewAllModal}
        onClose={() => setShowViewAllModal(false)}
        title="All Transactions"
      >
        <div className="all-transactions-modal">
          {transactions.length > 0 ? (
            <div className="transactions-grid">
              {transactions.map((tx, index) => (
                <div key={index} className="transaction-card">
                  <div className="transaction-header">
                    <h4>{tx.type}</h4>
                    <span className="transaction-amount">{tx.amount} {tx.symbol}</span>
                  </div>
                  <div className="transaction-details">
                    <p><strong>Recipient:</strong> {tx.recipient}</p>
                    <p><strong>Timestamp:</strong> {tx.timestamp}</p>
                    <p><strong>Hash:</strong> <span className="transaction-hash">{tx.hash}</span></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-transactions-message">
              <p>No transactions found. Your transaction history will appear here!</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
