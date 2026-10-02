import { getPortfolioForUser } from "../services/portfolio.service.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const portfolio = await getPortfolioForUser(req.user.id);
    const holdingsByReturn = [...portfolio.holdings].sort((a, b) => b.pnlPercentage - a.pnlPercentage);

    res.status(200).json({
      success: true,
      data: {
        ...portfolio,
        topGainers: holdingsByReturn.filter((holding) => holding.pnl >= 0).slice(0, 5),
        topLosers: holdingsByReturn.filter((holding) => holding.pnl < 0).slice(-5).reverse(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
