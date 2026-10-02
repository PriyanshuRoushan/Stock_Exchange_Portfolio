const value = (input) => Number.parseFloat(input || 0);

export const normalizeAngelOneHoldings = (holdings) =>
    holdings
        .filter((item) => item.tradingsymbol)
        .map((item) => {
            const quantity = value(item.quantity);
            const averageBuyPrice = value(item.averageprice);
            const currentPrice = value(item.ltp);
            const investedValue = quantity * averageBuyPrice;
            const currentValue = quantity * currentPrice;
            const pnl = item.profitandloss == null
                ? currentValue - investedValue
                : value(item.profitandloss);

            return {
                symbol: item.tradingsymbol,
                companyName: item.symbolname || item.tradingsymbol,
                exchange: item.exchange || "NSE",
                isin: item.isin || null,
                instrumentToken: item.symboltoken || null,
                quantity,
                averageBuyPrice,
                currentPrice,
                assetType: item.product || "EQUITY",
                investedValue,
                currentValue,
                pnl,
                pnlPercentage: item.pnlpercentage == null
                    ? (investedValue ? (pnl / investedValue) * 100 : 0)
                    : value(item.pnlpercentage),
                dayPnl: 0,
                dayChangePercentage: 0,
                currency: "INR",
            };
        });
