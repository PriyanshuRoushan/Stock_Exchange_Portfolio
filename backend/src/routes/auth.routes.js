import express from "express";
import { register, login, logout } from "../controllers/auth.controllers.js";
import verifyToken from "../middlewares/auth.middleware.js";
import pool from "../config/db.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, username, email FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = result.rows[0];
        res.status(200).json({
            message: "User is authenticated",
            userId: user.id,
            id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;