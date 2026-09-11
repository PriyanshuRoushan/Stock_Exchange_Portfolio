import axios from "axios";

const UPSTOX_HOLDINGS_URL =
  "https://api.upstox.com/v2/portfolio/long-term-holdings";

/**
 * Fetch raw holdings from Upstox.
 * Returns the raw holdings array.
 */
export const fetchUpstoxHoldings = async (accessToken) => {
  try {
    const { data } = await axios.get(UPSTOX_HOLDINGS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    return data.data;
  } catch (error) {
    console.error(
      "Upstox Holdings Fetch Error:",
      error.response?.data || error.message
    );

    throw new Error(
      `Failed to fetch Upstox holdings: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};