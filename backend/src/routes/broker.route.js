import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";

import {
    connectUpstox,
    upstoxCallback,
    connectZerodha,
    zerodhaCallback,
    getHoldings,
    getAccounts,
    syncBroker,
    getUpstoxAccountData,
    conncetAngelone,
    angeloneCallback,
    getAngelOneAccountData
} from "../controllers/broker.controller.js";

const router = express.Router();

router.get("/holdings", verifyToken, getHoldings);
router.get("/accounts", verifyToken, getAccounts);

router.get("/upstox/connect", verifyToken, connectUpstox);
router.get("/upstox/callback", upstoxCallback);
router.get("/upstox/account-data", verifyToken, getUpstoxAccountData);
router.get("/angelone/connect", verifyToken, conncetAngelone);
router.get("/angelone/callback", angeloneCallback);
router.get("/angelone/account-data", verifyToken, getAngelOneAccountData);
router.post("/:broker/sync", verifyToken, syncBroker);

router.get("/zerodha/connect", verifyToken, connectZerodha);
router.get("/zerodha/callback", zerodhaCallback);

export default router;
