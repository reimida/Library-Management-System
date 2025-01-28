import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.patch("/profile", authenticateToken, updateProfile); // Using PATCH since it's partial update

export default router; 