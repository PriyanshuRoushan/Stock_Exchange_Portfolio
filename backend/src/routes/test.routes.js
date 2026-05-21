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

        const broker = 1;



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



export default router;