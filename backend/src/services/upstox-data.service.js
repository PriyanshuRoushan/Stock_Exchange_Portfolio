import { fetchUpstoxProfile } from "../brokers/upstox/auth.service.js";
import {
    fetchUpstoxFunds,
    fetchUpstoxHoldingNews,
    fetchUpstoxMutualFundHoldings,
    fetchUpstoxOrders,
    fetchUpstoxPositions,
} from "../brokers/upstox/account.service.js";
import {
    getBrokerAccessToken,
    validateBrokerConnection,
} from "./sync.helper.js";

const AVAILABLE_RESOURCES = {
    positions: fetchUpstoxPositions,
    orders: fetchUpstoxOrders,
    funds: fetchUpstoxFunds,
    mutualFunds: fetchUpstoxMutualFundHoldings,
    news: fetchUpstoxHoldingNews,
    profile: fetchUpstoxProfile,
};

export const DEFAULT_UPSTOX_RESOURCES = [
    "positions",
    "orders",
    "funds",
    "mutualFunds",
    "news",
];

export const parseUpstoxResources = (include) => {
    if (!include) return DEFAULT_UPSTOX_RESOURCES;

    const resources = include
        .split(",")
        .map((resource) => resource.trim())
        .filter(Boolean);

    const invalid = resources.filter((resource) => !AVAILABLE_RESOURCES[resource]);
    if (invalid.length) {
        throw new Error(`Unsupported Upstox data type: ${invalid.join(", ")}`);
    }

    return [...new Set(resources)];
};

const publicError = (error) => ({
    status: error.status || 500,
    message: error.message || "Unable to fetch this Upstox resource",
});

/**
 * Fetches current data only for the authenticated user's Upstox account.
 * This is deliberately read-through: orders, funds, news, and mutual funds are
 * not stored until a historical-data policy and schema are introduced.
 */
export const getUpstoxSnapshot = async (userId, { resources, pageNumber, pageSize }) => {
    const account = await validateBrokerConnection(userId, "Upstox");
    const accessToken = await getBrokerAccessToken(account);

    const jobs = resources.map(async (resource) => {
        const fetchResource = AVAILABLE_RESOURCES[resource];
        const options = resource === "news" ? { pageNumber, pageSize } : undefined;
        return { resource, value: await fetchResource(accessToken, options) };
    });

    const results = await Promise.allSettled(jobs);
    const data = {};
    const errors = {};

    results.forEach((result, index) => {
        const resource = resources[index];
        if (result.status === "fulfilled") {
            data[result.value.resource] = result.value.value;
        } else {
            errors[resource] = publicError(result.reason);
        }
    });

    return {
        account: {
            broker: "Upstox",
            brokerUserName: account.broker_user_name,
            connectionStatus: account.connection_status,
            lastSyncedAt: account.last_synced_at,
        },
        fetchedAt: new Date().toISOString(),
        data,
        errors,
    };
};
