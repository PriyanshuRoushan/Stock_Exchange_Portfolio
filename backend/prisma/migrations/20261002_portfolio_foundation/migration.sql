-- Adds the indexes used by the authenticated portfolio and sync APIs.
-- All portfolio data columns already exist in the deployed schema.
CREATE INDEX IF NOT EXISTS holdings_account_symbol_idx
  ON holdings (connected_account_id, symbol);
CREATE INDEX IF NOT EXISTS holdings_active_idx
  ON holdings (connected_account_id, is_active);
