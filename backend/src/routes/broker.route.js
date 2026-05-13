import express from "express";

import {
    connectUpstock,
    upstockCallback,
    connectZerodha,
    zerodhaCallback
} from "../controllers/broker.controller.js";

const router = express.Router();

router.post("upstock/connect", connectUpstock);
router.post("upstock/callback", upstockCallback);

router.post("zerodha/connect", connectZerodha);
router.post("zerodha/callback", zerodhaCallback);

export default router;