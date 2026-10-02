import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { getDashboardOverview } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/overview", verifyToken, getDashboardOverview);

export default router;
