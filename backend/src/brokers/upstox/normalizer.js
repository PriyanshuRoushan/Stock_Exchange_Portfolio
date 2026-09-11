export const normalizeUpstoxHoldings = (
    holdings
) => {

    return holdings.map((item) => ({
        symbol: item.tradingSymbol,

        quantity: item.quantity,

        avg_price: item.average_price,

        current_price: item.last_price,

        asset_type: item.asset_type || "EQUITY"
    }));
};