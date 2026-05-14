// syncPortfolio()
// syncBrokerHoldings()
// validateBrokerConnection()
// getBrokerAccessToken()
// saveSyncLog()

import pool from "../config/db.js";

import { fetchUpstockHolding } from "../brokers/upstock/holding.service.js";

import {validateBrokerConnection} from './sync.helper.js';

// SYNC PORTFOLIO
const syncPortfolio = (userId, broker) => {
    try{
        // step1: validate broker connection
        const account = await validateBrokerConnection(userId, broker);

        // step2: get broker access token
        const accessToken = await getBrokerAccessToken(account);

        // step3: fetch broker holdings
        const holdings = await syncBrokerHoldings({broker, accessToken});

        // step4: normalize holdings
        const normalizeHoldings = brokerHoldings.map((item) => ({
            symbol: item.tradingSymbol,

            quantity: item.quantity,

            avg_Price: item.average_price,

            current_price: item.last_price,

            exchange: item.exchange
        }));
        
        // step5: save holdings
        for(const holding of normalizedHoldings){
            const existingHolding = await pool.query(
                `SELECT id
                FROM holdings
                WHERE connected_account_id = $1
                AND symbol = $2`,
                [
                    account.id,
                    holding.symbol
                ]
            );

        // update
        if( existingHolding.rows.length > 0 )
        {
            await pool.query(
                `UPDATE holdings
                SET quantity = $1
                avg_price = $2
                current_price = $3
                exchange = $4
                updated_at = NOW()
                WHERE connected_account_id = $5
                AND symbol = $6`,
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
        else {
            await pool.query(
                `INSERT INTO holdings (
                    connected_account-id,
                    symbol,
                    quantity,
                    avg_price,
                    current_price,
                    exchange
                    )
                    values($1, $2, $3, $4, $5, $6)`,
                    [
                        account.id,
                        holding,symbol,
                        holding.quantity,
                        holding.avg_price,
                        holding.current_price,
                        holding.exchange
                    ]
            );
        }
    }

    // step6: update last sinc time 
    await pool.query(
        `UPDATE connected_accounts
        SET last_synced_at = NOW()
        WHERE id = $1`,
        [account.id]
    );

    // step7: save sync log
    await saveSyncLog({
        connected_account_id: account.id,
        status: "success",

        message: "Portfolio synced successfully"
    });

    // step8: return final response
    return {
        status: true,
        broker,
        syncedHoldings: normalizedHoldings.length,
        holdings: normalizedHoldings,
        message: "Portfolio synced successfully"
    };

    }
    catch(error){
        console.error(
            "Portfolio Sync Error:",
            error.response?.data || error.message
        );


        /**
         * Save Failure Log
         */
        await saveSyncLog({
            connectedAccountId: null,
            status: "failed",
            message: error.message
        });

        throw new Error(
            "Portfolio sync failed"
        );
    }
};

