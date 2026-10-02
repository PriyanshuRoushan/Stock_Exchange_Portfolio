const value = (input) => Number.parseFloat(input || 0);

export const normalizeUpstoxHoldings = (holdings) =>
  holdings
    .filter((item) => item.trading_symbol || item.tradingsymbol)
    .map((item) => {
      const quantity = value(item.quantity);
      const averageBuyPrice = value(item.average_price);
      const currentPrice = value(item.last_price);
      const investedValue = quantity * averageBuyPrice;
      const currentValue = quantity * currentPrice;
      const pnl = item.pnl === undefined || item.pnl === null ? currentValue - investedValue : value(item.pnl);

      return {
        symbol: item.trading_symbol || item.tradingsymbol,
        companyName: item.company_name || item.trading_symbol || item.tradingsymbol,
        exchange: item.exchange || "NSE",
        isin: item.isin || null,
        instrumentToken: item.instrument_token || item.instrument_key || null,
        quantity,
        averageBuyPrice,
        currentPrice,
        assetType: item.asset_type || "EQUITY",
        investedValue,
        currentValue,
        pnl,
        pnlPercentage: investedValue ? (pnl / investedValue) * 100 : 0,
        dayPnl: value(item.day_change) * quantity,
        dayChangePercentage: value(item.day_change_percentage),
        currency: "INR",
      };
    });
