import { v4 as uuidv4 } from 'uuid';
import db from './database.js';

export class Token {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.symbol = data.symbol;
    this.supply = data.supply;
    this.decimals = data.decimals || 0;
    this.address = data.address || null;
    this.owner_address = data.owner_address;
    this.status = data.status || 'pending';
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  // Create a new token
  static async create(tokenData) {
    const token = new Token(tokenData);
    
    const stmt = db.prepare(`
      INSERT INTO tokens (id, name, symbol, supply, decimals, address, owner_address, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      token.id,
      token.name,
      token.symbol,
      token.supply,
      token.decimals,
      token.address,
      token.owner_address,
      token.status,
      token.created_at,
      token.updated_at
    );
    
    return token;
  }

  // Get token by ID
  static async findById(id) {
    const stmt = db.prepare('SELECT * FROM tokens WHERE id = ?');
    const row = stmt.get(id);
    return row ? new Token(row) : null;
  }

  // Get tokens by owner
  static async findByOwner(ownerAddress) {
    const stmt = db.prepare('SELECT * FROM tokens WHERE owner_address = ? ORDER BY created_at DESC');
    const rows = stmt.all(ownerAddress);
    return rows.map(row => new Token(row));
  }

  // Get all tokens
  static async findAll() {
    const stmt = db.prepare('SELECT * FROM tokens ORDER BY created_at DESC');
    const rows = stmt.all();
    return rows.map(row => new Token(row));
  }

  // Update token
  async update(updates) {
    const allowedFields = ['name', 'symbol', 'supply', 'decimals', 'address', 'status'];
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
    
    updateValues.push(new Date().toISOString()); // updated_at
    updateValues.push(this.id);
    
    const stmt = db.prepare(`
      UPDATE tokens 
      SET ${updateFields.join(', ')}, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(...updateValues);
    
    // Update local instance
    Object.assign(this, updates);
    this.updated_at = new Date().toISOString();
    
    return this;
  }

  // Delete token
  async delete() {
    const stmt = db.prepare('DELETE FROM tokens WHERE id = ?');
    stmt.run(this.id);
    return true;
  }

  // Get token value (mock calculation)
  getValue() {
    const supplyNum = parseInt(this.supply) || 0;
    return `$${(supplyNum * 1000).toLocaleString()}`;
  }

  // Get formatted address
  getFormattedAddress() {
    if (!this.address) return 'Pending...';
    return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      symbol: this.symbol,
      supply: this.supply,
      decimals: this.decimals,
      address: this.address,
      formattedAddress: this.getFormattedAddress(),
      owner_address: this.owner_address,
      status: this.status,
      value: this.getValue(),
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}
