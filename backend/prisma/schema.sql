-- Canonical PostgreSQL schema for the portfolio aggregator.
-- This script is safe to run on a fresh database. Existing installations should
-- use a reviewed migration rather than renaming or dropping data manually.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brokers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS connected_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  broker_id INTEGER NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  broker_user_name VARCHAR(100),
  broker_user_id VARCHAR(100) NOT NULL,
  broker_account_number VARCHAR(100),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMP NOT NULL,
  connection_status VARCHAR(20) NOT NULL DEFAULT 'connected',
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, broker_id)
);

CREATE TABLE IF NOT EXISTS holdings (
  id SERIAL PRIMARY KEY,
  connected_account_id INTEGER NOT NULL REFERENCES connected_accounts(id) ON DELETE CASCADE,
  symbol VARCHAR(50) NOT NULL,
  company_name TEXT,
  isin VARCHAR(20),
  instrument_token VARCHAR(100),
  exchange VARCHAR(10) DEFAULT 'NSE',
  quantity NUMERIC(18,4) NOT NULL,
  average_buy_price NUMERIC(18,4) NOT NULL,
  current_price NUMERIC(18,4) NOT NULL,
  invested_value NUMERIC(18,2),
  current_value NUMERIC(18,2),
  pnl NUMERIC(18,2),
  pnl_percentage NUMERIC(8,2),
  day_pnl NUMERIC(18,2),
  day_change_percentage NUMERIC(8,2),
  asset_type VARCHAR(20) NOT NULL,
  sector VARCHAR(100),
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_synced_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS holdings_account_symbol_idx
  ON holdings (connected_account_id, symbol);
CREATE INDEX IF NOT EXISTS holdings_active_idx
  ON holdings (connected_account_id, is_active);

CREATE TABLE IF NOT EXISTS sync_logs (
  id SERIAL PRIMARY KEY,
  connected_account_id INTEGER REFERENCES connected_accounts(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL,
  message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_ms INTEGER,
  broker_response JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
