import React, { useState } from 'react';

interface Token {
  address: string;
  name: string;
  symbol: string;
}

interface TransferSectionProps {
  tokens?: Token[];
  onTransfer?: (transferData: { tokenAddress: string; recipient: string; amount: string }) => void;
}

export const TransferSection: React.FC<TransferSectionProps> = ({ tokens = [], onTransfer }) => {
  const [selectedToken, setSelectedToken] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!selectedToken || !recipient || !amount) {
      alert('Please fill in all fields');
      return;
    }

    setIsTransferring(true);
    
    try {
      // Simulate transfer process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onTransfer) {
        onTransfer({
          tokenAddress: selectedToken,
          recipient: recipient,
          amount: amount
        });
      }
      
      // Reset form
      setRecipient('');
      setAmount('');
      
      // Show success message (this will be replaced with toast notifications)
      alert('Transfer completed successfully!');
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Transfer failed. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="homepage-section">
      <h3 className="section-header">Transfer</h3>
      
      <div className="form-group">
        <label htmlFor="tokenAddress" className="form-label">Token Address</label>
        <select
          id="tokenAddress"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="form-input"
        >
          <option value="">Select a token</option>
          {tokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="recipient" className="form-label">Recipient Add e.g. 0x123...</label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x742d...5E8a"
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="amount" className="form-label">Amount</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 100"
          className="form-input"
        />
      </div>
      
      <button
        onClick={handleTransfer}
        disabled={isTransferring}
        className="btn-primary transfer-token-btn"
      >
        {isTransferring ? 'Transferring...' : 'Transfer Token'}
      </button>
    </div>
  );
};
