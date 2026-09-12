import generateToken from "../utils/generateToken.js";
import { loginService, registerService } from "../services/auth.service.js";

export const login = async (req, res) => {
    try {
        const user = await loginService(req.body);
        const token = generateToken(user.id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        res.status(200).json({ ...user, token });
    } catch (err) {
        res.status(400).json({ error: err.message || "Invalid Credentials" });
    }
};

export const register = async (req, res) => {
    try {
        const user = await registerService(req.body);
        const token = generateToken(user.id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        res.status(201).json({ ...user, token });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(400).json({
            error: err.message || "Registration failed"
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    res.status(200).json({ message: "Logged out successfully" });
};