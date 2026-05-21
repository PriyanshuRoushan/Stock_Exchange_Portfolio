import pool from "../config/db.js";

import { brokerRegistry }
from "../registry/brokerRegistry.js";



/**
 * Validate Broker Connection
 */
export const validateBrokerConnection = async (
    userId,
    broker
) => {

    const result = await pool.query(
        `
        SELECT *
        FROM connected_accounts
        WHERE user_id = $1
        AND broker_id = $2
        `,
        [userId, broker]
    );

    if (result.rows.length === 0) {

        throw new Error(
            `No active ${broker} account connected`
        );
    }

    return result.rows[0];
};



/**
 * Get Broker Access Token
 */
export const getBrokerAccessToken = async (
    account
) => {

    if (!account.access_token) {

        throw new Error(
            "Broker access token missing"
        );
    }

    return account.access_token;
};



/**
 * Fetch Broker Holdings
 */
export const syncBrokerHoldings = async ({
    broker,
    accessToken
}) => {

    const brokerService =
        brokerRegistry[broker];

    if (!brokerService) {

        throw new Error(
            `Unsupported broker: ${broker}`
        );
    }

    return await brokerService
        .fetchHoldings(accessToken);
};



/**
 * Normalize Broker Holdings
 */
export const normalizeBrokerHoldings = ({
    broker,
    holdings
}) => {

    const brokerService =
        brokerRegistry[broker];

    if (!brokerService) {

        throw new Error(
            `Unsupported broker: ${broker}`
        );
    }

    return brokerService
        .normalizeHoldings(holdings);
};



/**
 * Save Sync Log
 */
export const saveSyncLog = async ({
    connected_account_id,
    status,
    message
}) => {

    await pool.query(
        `
        INSERT INTO sync_logs (
            connected_account_id,
            status,
            message
        )
        VALUES ($1, $2, $3)
        `,
        [
            connected_account_id,
            status,
            message
        ]
    );
};