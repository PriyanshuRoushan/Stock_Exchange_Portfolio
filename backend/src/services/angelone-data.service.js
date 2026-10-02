import { fetchAngelOneProfile } from "../brokers/angelone/auth.service.js";
import {
    fetchAngelOneFunds,
    fetchAngelOneOrders,
    fetchAngelOnePositions,
} from "../brokers/angelone/account.service.js";
import {
    getBrokerAccessToken,
    validateBrokerConnection,
} from "./sync.helper.js";

const RESOURCES = {
    positions: fetchAngelOnePositions,
    orders: fetchAngelOneOrders,
    funds: fetchAngelOneFunds,
    profile: fetchAngelOneProfile,
};

export const parseAngelOneResources = (include) => {
    if (!include) return ["positions", "orders", "funds"];
    const resources = include.split(",").map((value) => value.trim()).filter(Boolean);
    const invalid = resources.filter((resource) => !RESOURCES[resource]);
    if (invalid.length) throw new Error(`Unsupported Angel One data type: ${invalid.join(", ")}`);
    return [...new Set(resources)];
};

export const getAngelOneSnapshot = async (userId, resources) => {
    const account = await validateBrokerConnection(userId, "Angel One");
    const accessToken = await getBrokerAccessToken(account);
    const results = await Promise.allSettled(
        resources.map(async (resource) => ({ resource, value: await RESOURCES[resource](accessToken) }))
    );
    const data = {};
    const errors = {};

    results.forEach((result, index) => {
        const resource = resources[index];
        if (result.status === "fulfilled") data[result.value.resource] = result.value.value;
        else errors[resource] = {
            status: result.reason.status || 500,
            message: result.reason.message || "Unable to fetch this Angel One resource",
        };
    });

    return {
        account: {
            broker: "Angel One",
            brokerUserName: account.broker_user_name,
            connectionStatus: account.connection_status,
            lastSyncedAt: account.last_synced_at,
        },
        fetchedAt: new Date().toISOString(),
        data,
        errors,
    };
};
