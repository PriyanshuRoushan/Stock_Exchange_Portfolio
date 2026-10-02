import axios from "axios";

const UPSTOX_BASE_URL = "https://api.upstox.com";

const getClient = (accessToken) =>
    axios.create({
        baseURL: UPSTOX_BASE_URL,
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

const readData = (response) => response.data?.data ?? response.data;

const toUpstoxError = (label, error) => {
    const status = error.response?.status;
    const apiError = error.response?.data?.errors?.[0] || error.response?.data;
    const message = apiError?.message || apiError?.error || error.message;
    const wrapped = new Error(`Unable to fetch Upstox ${label}: ${message}`);
    wrapped.status = status;
    throw wrapped;
};

export const fetchUpstoxPositions = async (accessToken) => {
    try {
        return readData(await getClient(accessToken).get("/v2/portfolio/short-term-positions"));
    } catch (error) {
        return toUpstoxError("positions", error);
    }
};

export const fetchUpstoxOrders = async (accessToken) => {
    try {
        return readData(await getClient(accessToken).get("/v2/order/retrieve-all"));
    } catch (error) {
        return toUpstoxError("orders", error);
    }
};

export const fetchUpstoxFunds = async (accessToken) => {
    try {
        return readData(
            await getClient(accessToken).get("/v3/user/get-funds-and-margin", {
                headers: { "Api-Version": "3.0" },
            })
        );
    } catch (error) {
        return toUpstoxError("funds and margin", error);
    }
};

export const fetchUpstoxMutualFundHoldings = async (accessToken) => {
    try {
        return readData(await getClient(accessToken).get("/v2/mf/holdings"));
    } catch (error) {
        return toUpstoxError("mutual fund holdings", error);
    }
};

export const fetchUpstoxHoldingNews = async (
    accessToken,
    { pageNumber = 1, pageSize = 20 } = {}
) => {
    try {
        return readData(
            await getClient(accessToken).get("/v2/news", {
                params: {
                    category: "holdings",
                    page_number: pageNumber,
                    page_size: pageSize,
                },
            })
        );
    } catch (error) {
        return toUpstoxError("holding news", error);
    }
};
