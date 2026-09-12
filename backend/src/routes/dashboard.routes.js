import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { getDashboardOverview } from "../controllers/dashboard.controller.js";

const router = express.Router();

// Optional auth token verification: if token is present, populate req.user; if not, still allow access
const optionalVerifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return verifyToken(req, res, next);
    }
    // Also check cookies
    if (req.cookies && req.cookies.token) {
      return verifyToken(req, res, next);
    }
  } catch {
    // Proceed as unauthenticated
  }
  next();
};

router.get("/overview", optionalVerifyToken, getDashboardOverview);

export default router;
