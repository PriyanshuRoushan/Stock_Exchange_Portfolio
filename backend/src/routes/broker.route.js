import express from "express";

import {
    connectUpstox,
    upstoxCallback,
    connectZerodha,
    zerodhaCallback
} from "../controllers/broker.controller.js";

const router = express.Router();

router.get("/upstox/connect", connectUpstox);
router.post("upstox/callback", upstoxCallback);

router.get("/zerodha/connect", connectZerodha);
router.post("zerodha/callback", zerodhaCallback);

export default router;