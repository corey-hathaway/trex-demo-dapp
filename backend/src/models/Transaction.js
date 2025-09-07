import { v4 as uuidv4 } from 'uuid';
import db from './database.js';

export class Transaction {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.token_id = data.token_id;
    this.type = data.type;
    this.amount = data.amount;
    this.recipient = data.recipient;
    this.hash = data.hash || null;
    this.status = data.status || 'pending';
    this.created_at = data.created_at || new Date().toISOString();
  }

  // Create a new transaction
  static async create(transactionData) {
    const transaction = new Transaction(transactionData);
    
    const stmt = db.prepare(`
      INSERT INTO transactions (id, token_id, type, amount, recipient, hash, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      transaction.id,
      transaction.token_id,
      transaction.type,
      transaction.amount,
      transaction.recipient,
      transaction.hash,
      transaction.status,
      transaction.created_at
    );
    
    return transaction;
  }

  // Get transaction by ID
  static async findById(id) {
    const stmt = db.prepare('SELECT * FROM transactions WHERE id = ?');
    const row = stmt.get(id);
    return row ? new Transaction(row) : null;
  }

  // Get transactions by token ID
  static async findByTokenId(tokenId) {
    const stmt = db.prepare('SELECT * FROM transactions WHERE token_id = ? ORDER BY created_at DESC');
    const rows = stmt.all(tokenId);
    return rows.map(row => new Transaction(row));
  }

  // Get all transactions
  static async findAll() {
    const stmt = db.prepare('SELECT * FROM transactions ORDER BY created_at DESC');
    const rows = stmt.all();
    return rows.map(row => new Transaction(row));
  }

  // Get transactions with token details
  static async findAllWithTokens() {
    const stmt = db.prepare(`
      SELECT 
        t.*,
        tok.name as token_name,
        tok.symbol as token_symbol
      FROM transactions t
      LEFT JOIN tokens tok ON t.token_id = tok.id
      ORDER BY t.created_at DESC
    `);
    const rows = stmt.all();
    return rows.map(row => ({
      ...new Transaction(row).toJSON(),
      token_name: row.token_name,
      token_symbol: row.token_symbol
    }));
  }

  // Update transaction
  async update(updates) {
    const allowedFields = ['type', 'amount', 'recipient', 'hash', 'status'];
    const updateFields = [];
    const updateValues = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    }
    
    if (updateFields.length === 0) {
      return this;
    }
    
    updateValues.push(this.id);
    
    const stmt = db.prepare(`
      UPDATE transactions 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...updateValues);
    
    // Update local instance
    Object.assign(this, updates);
    
    return this;
  }

  // Delete transaction
  async delete() {
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    stmt.run(this.id);
    return true;
  }

  // Get formatted hash
  getFormattedHash() {
    if (!this.hash) return 'Pending...';
    return `${this.hash.slice(0, 8)}...`;
  }

  // Get relative timestamp
  getRelativeTime() {
    const now = new Date();
    const created = new Date(this.created_at);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return created.toLocaleDateString();
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      token_id: this.token_id,
      type: this.type,
      amount: this.amount,
      symbol: this.symbol || 'TOKEN',
      recipient: this.recipient,
      hash: this.hash,
      formattedHash: this.getFormattedHash(),
      status: this.status,
      timestamp: this.getRelativeTime(),
      created_at: this.created_at
    };
  }
}
