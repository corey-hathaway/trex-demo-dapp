import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure data directory exists
const dataDir = join(__dirname, '../../data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || join(dataDir, 'tokens.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Tokens table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      supply TEXT NOT NULL,
      decimals INTEGER DEFAULT 0,
      address TEXT,
      owner_address TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      token_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount TEXT NOT NULL,
      recipient TEXT NOT NULL,
      hash TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (token_id) REFERENCES tokens (id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_tokens_owner ON tokens(owner_address);
    CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
    CREATE INDEX IF NOT EXISTS idx_transactions_token ON transactions(token_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
  `);
};

// Initialize database
createTables();

export default db;
