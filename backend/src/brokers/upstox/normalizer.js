export const normalizeUpstoxHoldings = (
    holdings
) => {

    return holdings.map((item) => ({
        symbol: item.tradingSymbol,

        quantity: item.quantity,

        avg_price: item.average_price,

        current_price: item.last_price,

        exchange: item.exchange
    }));
};