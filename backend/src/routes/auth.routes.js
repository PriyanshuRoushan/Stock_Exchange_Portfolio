import express from "express";
import { register, login} from "../controllers/auth.controllers.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", verifyToken, (req, res) => {
    res.status(200).json({
        message: "User is authenticated",
        userId: req.user.id
    });
});

export default router;