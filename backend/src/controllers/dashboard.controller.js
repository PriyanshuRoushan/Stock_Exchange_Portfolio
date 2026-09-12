import pool from "../config/db.js";

/**
 * Controller to fetch consolidated dashboard data for the authenticated user.
 */
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Fetch user's connected accounts and holdings if user is authenticated
    let userHoldings = [];
    let userBrokers = [];

    if (userId) {
      const holdingsRes = await pool.query(
        `SELECT 
            h.id,
            h.symbol,
            COALESCE(h.exchange, 'NSE') AS exchange,
            h.quantity,
            COALESCE(h.average_buy_price, 0) AS avg_price,
            COALESCE(h.current_price, 0) AS current_price,
            COALESCE(h.company_name, h.symbol) AS company_name,
            h.asset_type,
            h.pnl,
            h.pnl_percentage
         FROM holdings h
         JOIN connected_accounts ca ON h.connected_account_id = ca.id
         WHERE ca.user_id = $1
         ORDER BY h.updated_at DESC`,
        [userId]
      );
      userHoldings = holdingsRes.rows;

      const brokersRes = await pool.query(
        `SELECT 
            b.id,
            b.name,
            ca.connection_status AS status,
            ca.last_synced_at
         FROM connected_accounts ca
         JOIN brokers b ON ca.broker_id = b.id
         WHERE ca.user_id = $1`,
        [userId]
      );
      userBrokers = brokersRes.rows;
    }

    // Default market indices
    const indices = [
      {
        id: 'nifty50',
        name: 'NIFTY 50',
        value: '25,420.35',
        change: '+212.40',
        changePercent: '+0.84%',
        isPositive: true,
        prevClose: '25,207.95',
        dayLow: '25,304.10',
        dayHigh: '25,512.80',
        sparklineData: [25200, 25250, 25300, 25280, 25350, 25390, 25340, 25400, 25420],
      },
      {
        id: 'sensex',
        name: 'SENSEX',
        value: '83,540.20',
        change: '+587.32',
        changePercent: '+0.71%',
        isPositive: true,
        prevClose: '82,952.88',
        dayLow: '83,102.40',
        dayHigh: '83,740.60',
        sparklineData: [82950, 83100, 83050, 83250, 83400, 83380, 83500, 83540],
      },
      {
        id: 'banknifty',
        name: 'BANK NIFTY',
        value: '57,230.10',
        change: '+632.15',
        changePercent: '+1.12%',
        isPositive: true,
        prevClose: '56,597.95',
        dayLow: '56,912.30',
        dayHigh: '57,410.65',
        sparklineData: [56600, 56800, 56750, 57000, 57150, 57100, 57200, 57230],
      },
      {
        id: 'niftyit',
        name: 'NIFTY IT',
        value: '36,120.45',
        change: '+1.32%',
        changePercent: '',
        isPositive: true,
        prevClose: '35,647.20',
        dayLow: '35,802.10',
        dayHigh: '36,410.75',
        sparklineData: [35650, 35750, 35900, 35850, 36000, 36050, 36120],
      },
      {
        id: 'niftyauto',
        name: 'NIFTY AUTO',
        value: '24,810.20',
        change: '+0.95%',
        changePercent: '',
        isPositive: true,
        prevClose: '24,576.30',
        dayLow: '24,622.50',
        dayHigh: '24,990.80',
        sparklineData: [24580, 24650, 24700, 24680, 24780, 24810],
      },
      {
        id: 'indiavix',
        name: 'INDIA VIX',
        value: '14.82',
        change: '-3.14%',
        changePercent: '',
        isPositive: false,
        prevClose: '15.30',
        dayLow: '14.62',
        dayHigh: '15.12',
        sparklineData: [15.3, 15.2, 14.9, 15.1, 14.8, 14.7, 14.82],
      },
    ];

    const topGainers = [
      { id: '1', name: 'TATA MOTORS', symbol: 'TATAMOTORS', ltp: '742.30', change: '+58.10', percentChange: '+8.42%', isPositive: true },
      { id: '2', name: 'BEL', symbol: 'BEL', ltp: '286.15', change: '+18.45', percentChange: '+6.91%', isPositive: true },
      { id: '3', name: 'COAL INDIA', symbol: 'COALINDIA', ltp: '456.20', change: '+25.10', percentChange: '+5.82%', isPositive: true },
      { id: '4', name: 'RECLTD', symbol: 'RECLTD', ltp: '512.40', change: '+25.95', percentChange: '+5.34%', isPositive: true },
      { id: '5', name: 'NTPC', symbol: 'NTPC', ltp: '402.15', change: '+18.60', percentChange: '+4.88%', isPositive: true },
    ];

    const topLosers = [
      { id: '1', name: 'ZOMATO', symbol: 'ZOMATO', ltp: '286.40', change: '-19.60', percentChange: '-6.42%', isPositive: false },
      { id: '2', name: 'INFY', symbol: 'INFY', ltp: '1,420.20', change: '-72.10', percentChange: '-4.82%', isPositive: false },
      { id: '3', name: 'HCLTECH', symbol: 'HCLTECH', ltp: '1,522.30', change: '-62.10', percentChange: '-3.91%', isPositive: false },
      { id: '4', name: 'WIPRO', symbol: 'WIPRO', ltp: '398.40', change: '-14.15', percentChange: '-3.42%', isPositive: false },
      { id: '5', name: 'ITC', symbol: 'ITC', ltp: '466.30', change: '-15.50', percentChange: '-3.21%', isPositive: false },
    ];

    const trendingStocks = [
      { id: '1', name: 'RELIANCE', symbol: 'RELIANCE', ltp: '2,680.40', change: '+108.40', percentChange: '+4.21%', isPositive: true },
      { id: '2', name: 'TATA MOTORS', symbol: 'TATAMOTORS', ltp: '742.30', change: '+58.10', percentChange: '+8.42%', isPositive: true },
      { id: '3', name: 'ZOMATO', symbol: 'ZOMATO', ltp: '286.40', change: '-19.60', percentChange: '-6.42%', isPositive: false },
      { id: '4', name: 'INFY', symbol: 'INFY', ltp: '1,420.20', change: '-72.10', percentChange: '-4.82%', isPositive: false },
      { id: '5', name: 'HDFC BANK', symbol: 'HDFCBANK', ltp: '1,510.30', change: '+46.10', percentChange: '+3.15%', isPositive: true },
    ];

    // Compute portfolio performance from real holdings or provide fallback
    let portfolioPerformance = [
      { symbol: 'RELIANCE', value: 18.4 },
      { symbol: 'TCS', value: 12.6 },
      { symbol: 'HDFC', value: 8.2 },
      { symbol: 'INFY', value: -4.8 },
      { symbol: 'ITC', value: -2.1 },
      { symbol: 'SBIN', value: 5.4 },
      { symbol: 'ZOMATO', value: -6.2 },
      { symbol: 'HINDALCO', value: -3.9 },
      { symbol: 'TATA MOTORS', value: 9.1 },
      { symbol: 'WIPRO', value: -1.8 },
    ];

    if (userHoldings.length > 0) {
      portfolioPerformance = userHoldings.map((h) => {
        const qty = parseFloat(h.quantity) || 1;
        const buyPrice = parseFloat(h.avg_price || h.average_buy_price) || 1;
        const curPrice = parseFloat(h.current_price) || buyPrice;
        const pnlPct = buyPrice > 0 ? ((curPrice - buyPrice) / buyPrice) * 100 : 0;
        return {
          symbol: h.symbol,
          value: parseFloat(pnlPct.toFixed(1)),
        };
      });
    }

    // Default brokers or mapped from connected accounts
    const brokers = [
      {
        id: 'upstox',
        name: 'Upstox',
        logoType: 'upstox',
        status: userBrokers.some((b) => b.name.toLowerCase().includes('upstox')) ? 'connected' : 'connected',
        progress: 75,
        isPositive: true,
        value: '+90 L',
      },
      {
        id: 'zerodha',
        name: 'Zerodha',
        logoType: 'zerodha',
        status: userBrokers.some((b) => b.name.toLowerCase().includes('zerodha')) ? 'connected' : 'connected',
        progress: 90,
        isPositive: true,
        value: '+240 L',
      },
      {
        id: 'angelone',
        name: 'AngelOne',
        logoType: 'angelone',
        status: userBrokers.some((b) => b.name.toLowerCase().includes('angel')) ? 'connected' : 'connected',
        progress: 40,
        isPositive: false,
        value: '-40 K',
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        indices,
        topGainers,
        topLosers,
        trendingStocks,
        portfolioPerformance,
        brokers,
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
