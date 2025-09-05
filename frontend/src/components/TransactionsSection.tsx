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
  // Mock data for demonstration
  const mockTransactions: Transaction[] = [
    {
      type: 'Transfer',
      amount: '50',
      symbol: 'CPL',
      recipient: '0x742d...5E8a',
      timestamp: '2 hours ago',
      hash: '0xabc123...'
    },
    {
      type: 'Transfer',
      amount: '25',
      symbol: 'REF',
      recipient: '0x1234...5678',
      timestamp: '4 hours ago',
      hash: '0xdef456...'
    },
    {
      type: 'Mint',
      amount: '1000',
      symbol: 'CPL',
      recipient: 'New Token',
      timestamp: '1 day ago',
      hash: '0xghi789...'
    },
    {
      type: 'Transfer',
      amount: '10',
      symbol: 'CPL',
      recipient: '0x9876...5432',
      timestamp: '2 days ago',
      hash: '0xjkl012...'
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;

  return (
    <div className="homepage-section">
      <h3 className="section-header">Transactions</h3>
      
      <div className="transactions-list">
        {displayTransactions.map((tx, index) => (
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
        ))}
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
