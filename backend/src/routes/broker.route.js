import express from "express";

import {
    connectUpstock,
    upstockCallback
} from "../controllers/broker.controller.js";

const router = express.Router();

router.post("upstock/connect", connectUpstock);
router.post("upstock/callback", upstockCallback);



export default router;