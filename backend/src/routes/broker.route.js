import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";

import {
    connectUpstox,
    upstoxCallback,
    connectZerodha,
    zerodhaCallback,
    getHoldings
} from "../controllers/broker.controller.js";

const router = express.Router();

router.get("/holdings", verifyToken, getHoldings);

router.get("/upstox/connect", verifyToken, connectUpstox);
router.get("/upstox/callback", upstoxCallback);

router.get("/zerodha/connect", verifyToken, connectZerodha);
router.get("/zerodha/callback", zerodhaCallback);

export default router;