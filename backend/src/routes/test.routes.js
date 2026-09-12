import express from "express";

import {
    syncPortfolio
} from "../services/sync.service.js";

const router = express.Router();



router.get("/sync-test", async (req, res) => {

    try {

        /**
         * Replace with actual values
         */
        const userId = 1;

        const broker = "Upstox";



        const result =
            await syncPortfolio(
                userId,
                broker
            );



        return res.status(200).json({
            success: true,
            data: result
        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});



router.get("/db-test", async (req, res) => {
    try {
        const pool = (await import("../config/db.js")).default;
        const nowRes = await pool.query("SELECT NOW()");
        const usersRes = await pool.query("SELECT COUNT(*) FROM users");
        const brokersRes = await pool.query("SELECT COUNT(*) FROM brokers");
        const accountsRes = await pool.query("SELECT COUNT(*) FROM connected_accounts");
        const holdingsRes = await pool.query("SELECT COUNT(*) FROM holdings");

        return res.status(200).json({
            success: true,
            status: "connected",
            dbTime: nowRes.rows[0].now,
            counts: {
                users: parseInt(usersRes.rows[0].count, 10),
                brokers: parseInt(brokersRes.rows[0].count, 10),
                connectedAccounts: parseInt(accountsRes.rows[0].count, 10),
                holdings: parseInt(holdingsRes.rows[0].count, 10)
            }
        });
    } catch (error) {
        console.error("DB Test Error:", error);
        return res.status(500).json({
            success: false,
            status: "error",
            message: error.message
        });
    }
});

export default router;