import pool from "../config/db.js";
import {
  getBrokerAccessToken,
  normalizeBrokerHoldings,
  saveSyncLog,
  syncBrokerHoldings,
  validateBrokerConnection,
} from "./sync.helper.js";

const upsertHolding = async (client, accountId, holding) => {
  const existing = await client.query(
    `SELECT id FROM holdings
     WHERE connected_account_id = $1
       AND symbol = $2
       AND COALESCE(exchange, 'NSE') = COALESCE($3, 'NSE')
     LIMIT 1`,
    [accountId, holding.symbol, holding.exchange]
  );

  const values = [
    holding.quantity,
    holding.averageBuyPrice,
    holding.currentPrice,
    holding.assetType,
    holding.companyName,
    holding.isin,
    holding.exchange,
    holding.investedValue,
    holding.currentValue,
    holding.pnl,
    holding.pnlPercentage,
    holding.dayPnl,
    holding.dayChangePercentage,
    holding.currency,
    holding.instrumentToken,
  ];

  if (existing.rows.length) {
    await client.query(
      `UPDATE holdings SET
        quantity = $1, average_buy_price = $2, current_price = $3, asset_type = $4,
        company_name = $5, isin = $6, exchange = $7, invested_value = $8,
        current_value = $9, pnl = $10, pnl_percentage = $11, day_pnl = $12,
        day_change_percentage = $13, currency = $14, instrument_token = $15,
        is_active = true, last_synced_at = NOW(), updated_at = NOW()
       WHERE id = $16`,
      [...values, existing.rows[0].id]
    );
  } else {
    await client.query(
      `INSERT INTO holdings (
        connected_account_id, symbol, quantity, average_buy_price, current_price,
        asset_type, company_name, isin, exchange, invested_value, current_value,
        pnl, pnl_percentage, day_pnl, day_change_percentage, currency,
        instrument_token, is_active, last_synced_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, true, NOW()
      )`,
      [accountId, holding.symbol, ...values]
    );
  }
};

export const syncPortfolio = async (userId, broker) => {
  let account;
  try {
    account = await validateBrokerConnection(userId, broker);
    const accessToken = await getBrokerAccessToken(account);
    const rawHoldings = await syncBrokerHoldings({ broker, accessToken });
    const holdings = normalizeBrokerHoldings({ broker, holdings: rawHoldings });
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query(
        "UPDATE holdings SET is_active = false WHERE connected_account_id = $1",
        [account.id]
      );
      for (const holding of holdings) await upsertHolding(client, account.id, holding);
      await client.query(
        "UPDATE connected_accounts SET last_synced_at = NOW(), connection_status = 'connected', updated_at = NOW() WHERE id = $1",
        [account.id]
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    await saveSyncLog({
      connected_account_id: account.id,
      status: "success",
      message: `Synced ${holdings.length} ${broker} holdings`,
    });

    return { broker, accountId: account.id, syncedHoldings: holdings.length, holdings };
  } catch (error) {
    if (account?.id) {
      await pool.query(
        "UPDATE connected_accounts SET connection_status = 'error', updated_at = NOW() WHERE id = $1",
        [account.id]
      );
    }
    await saveSyncLog({
      connected_account_id: account?.id || null,
      status: "failed",
      message: `${broker} sync failed: ${error.message}`,
    });
    throw error;
  }
};
