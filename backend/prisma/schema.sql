-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create brokers table
CREATE TABLE IF NOT EXISTS brokers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create connected_accounts table
CREATE TABLE IF NOT EXISTS connected_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    broker_id INTEGER NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    broker_user_name VARCHAR(100),
    broker_user_id VARCHAR(100) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expiry TIMESTAMP NOT NULL,
    connection_status VARCHAR(20) DEFAULT 'connected',
    last_synced_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, broker_id)
);

-- Create holdings table
CREATE TABLE IF NOT EXISTS holdings (
    id SERIAL PRIMARY KEY,
    connected_account_id INTEGER NOT NULL REFERENCES connected_accounts(id) ON DELETE CASCADE,
    symbol VARCHAR(50) NOT NULL,
    quantity DECIMAL(12, 4) NOT NULL,
    avg_price DECIMAL(12, 4) NOT NULL,
    current_price DECIMAL(12, 4) NOT NULL,
    asset_type VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sync_logs table
CREATE TABLE IF NOT EXISTS sync_logs (
    id SERIAL PRIMARY KEY,
    connected_account_id INTEGER REFERENCES connected_accounts(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
