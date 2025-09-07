import React from 'react';

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
  console.log('TransactionsSection - transactions received:', transactions);
  console.log('TransactionsSection - transactions.length:', transactions.length);

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
        onClick={onViewAll}
        className="btn-secondary view-all-btn"
      >
        View All
      </button>
    </div>
  );
};
