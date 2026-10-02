import pool from "../config/db.js";

const number = (value) => Number.parseFloat(value || 0);

const toHoldingDto = (holding) => ({
  id: holding.id,
  symbol: holding.symbol,
  companyName: holding.company_name || holding.symbol,
  exchange: holding.exchange || "NSE",
  isin: holding.isin,
  instrumentToken: holding.instrument_token,
  assetType: holding.asset_type,
  sector: holding.sector,
  broker: holding.broker_name,
  brokerId: holding.broker_id,
  quantity: number(holding.quantity),
  averageBuyPrice: number(holding.average_buy_price),
  currentPrice: number(holding.current_price),
  investedValue: number(holding.invested_value),
  currentValue: number(holding.current_value),
  pnl: number(holding.pnl),
  pnlPercentage: number(holding.pnl_percentage),
  dayPnl: number(holding.day_pnl),
  dayChangePercentage: number(holding.day_change_percentage),
  currency: holding.currency || "INR",
  lastSyncedAt: holding.last_synced_at || holding.updated_at,
});

export const getPortfolioForUser = async (userId) => {
  const holdingsResult = await pool.query(
    `SELECT
      h.id, h.symbol, h.company_name, h.exchange, h.isin, h.instrument_token,
      h.asset_type, h.sector, h.quantity, h.average_buy_price, h.current_price,
      h.invested_value, h.current_value, h.pnl, h.pnl_percentage, h.day_pnl,
      h.day_change_percentage, h.currency, h.last_synced_at, h.updated_at,
      b.id AS broker_id, b.name AS broker_name
     FROM holdings h
     JOIN connected_accounts ca ON ca.id = h.connected_account_id
     JOIN brokers b ON b.id = ca.broker_id
     WHERE ca.user_id = $1 AND COALESCE(h.is_active, true) = true
     ORDER BY h.current_value DESC NULLS LAST, h.symbol ASC`,
    [userId]
  );

  const accountsResult = await pool.query(
    `SELECT
       ca.id, b.id AS broker_id, b.name AS broker_name, b.type AS broker_type,
       ca.broker_user_name, ca.broker_user_id, ca.connection_status,
       ca.last_synced_at, ca.token_expiry,
       COALESCE(SUM(h.current_value) FILTER (WHERE COALESCE(h.is_active, true)), 0) AS current_value,
       COUNT(h.id) FILTER (WHERE COALESCE(h.is_active, true)) AS holdings_count
     FROM connected_accounts ca
     JOIN brokers b ON b.id = ca.broker_id
     LEFT JOIN holdings h ON h.connected_account_id = ca.id
     WHERE ca.user_id = $1
     GROUP BY ca.id, b.id
     ORDER BY b.name`,
    [userId]
  );

  const holdings = holdingsResult.rows.map(toHoldingDto);
  const totals = holdings.reduce(
    (summary, holding) => ({
      investedValue: summary.investedValue + holding.investedValue,
      currentValue: summary.currentValue + holding.currentValue,
      pnl: summary.pnl + holding.pnl,
      dayPnl: summary.dayPnl + holding.dayPnl,
    }),
    { investedValue: 0, currentValue: 0, pnl: 0, dayPnl: 0 }
  );

  return {
    summary: {
      ...totals,
      pnlPercentage: totals.investedValue ? (totals.pnl / totals.investedValue) * 100 : 0,
      holdingsCount: holdings.length,
      profitableHoldings: holdings.filter((holding) => holding.pnl >= 0).length,
      lossMakingHoldings: holdings.filter((holding) => holding.pnl < 0).length,
    },
    accounts: accountsResult.rows.map((account) => ({
      id: account.id,
      brokerId: account.broker_id,
      brokerName: account.broker_name,
      brokerType: account.broker_type,
      brokerUserName: account.broker_user_name,
      status: account.connection_status,
      lastSyncedAt: account.last_synced_at,
      tokenExpiry: account.token_expiry,
      currentValue: number(account.current_value),
      holdingsCount: Number.parseInt(account.holdings_count, 10),
    })),
    holdings,
  };
};
