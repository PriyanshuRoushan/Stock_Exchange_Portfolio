// syncPortfolio()
// syncBrokerHoldings()
// validateBrokerConnection()
// getBrokerAccessToken()
// saveSyncLog()

import pool from "../config/db.js";

import {
    validateBrokerConnection,
    getBrokerAccessToken,
    syncBrokerHoldings,
    normalizeBrokerHoldings,
    saveSyncLog
} from "./sync.helper.js";

/**
 * Sync Portfolio
 */
export const syncPortfolio = async (
    userId,
    broker
) => {

    try {

        /**
         * Step 1:
         * Validate Broker Connection
         */
        const account =
            await validateBrokerConnection(
                userId,
                broker
            );



        /**
         * Step 2:
         * Get Broker Access Token
         */
        const accessToken =
            await getBrokerAccessToken(
                account
            );



        /**
         * Step 3:
         * Fetch Broker Holdings
         */
        const holdings =
            await syncBrokerHoldings({
                broker,
                accessToken
            });



        /**
         * Step 4:
         * Normalize Broker Holdings
         */
        const normalizedHoldings =
            normalizeBrokerHoldings({
                broker,
                holdings
            });



        /**
         * Step 5:
         * Save / Update Holdings
         */
        for (const holding of normalizedHoldings) {

            /**
             * Check Existing Holding
             */
            const existingHolding =
                await pool.query(
                    `
                    SELECT id
                    FROM holdings
                    WHERE connected_account_id = $1
                    AND symbol = $2
                    `,
                    [
                        account.id,
                        holding.symbol
                    ]
                );



            /**
             * Update Existing Holding
             */
            if (existingHolding.rows.length > 0) {

                await pool.query(
                    `
                    UPDATE holdings
                    SET
                        quantity = $1,
                        avg_price = $2,
                        current_price = $3,
                        exchange = $4,
                        updated_at = NOW()
                    WHERE connected_account_id = $5
                    AND symbol = $6
                    `,
                    [
                        holding.quantity,
                        holding.avg_price,
                        holding.current_price,
                        holding.exchange,
                        account.id,
                        holding.symbol
                    ]
                );

            }

            /**
             * Insert New Holding
             */
            else {

                await pool.query(
                    `
                    INSERT INTO holdings (
                        connected_account_id,
                        symbol,
                        quantity,
                        avg_price,
                        current_price,
                        exchange
                    )
                    VALUES ($1, $2, $3, $4, $5, $6)
                    `,
                    [
                        account.id,
                        holding.symbol,
                        holding.quantity,
                        holding.avg_price,
                        holding.current_price,
                        holding.exchange
                    ]
                );
            }
        }



        /**
         * Step 6:
         * Update Last Synced Time
         */
        await pool.query(
            `
            UPDATE connected_accounts
            SET last_synced_at = NOW()
            WHERE id = $1
            `,
            [account.id]
        );



        /**
         * Step 7:
         * Save Success Sync Log
         */
        await saveSyncLog({
            connected_account_id: account.id,
            status: "success",
            message: "Portfolio synced successfully"
        });



        /**
         * Step 8:
         * Return Final Response
         */
        return {
            success: true,
            broker,
            syncedHoldings:
                normalizedHoldings.length,

            holdings:
                normalizedHoldings,

            message:
                "Portfolio synced successfully"
        };

    }

    catch (error) {

        console.error(
            "Portfolio Sync Error:",
            error.response?.data ||
            error.message
        );



        /**
         * Save Failure Log
         */
        await saveSyncLog({
            connected_account_id: null,
            status: "failed",
            message: error.message
        });



        throw new Error(
            "Portfolio sync failed"
        );
    }
};
