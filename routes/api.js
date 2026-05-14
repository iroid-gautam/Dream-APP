import express from "express";
import authRoutes from "../src/auth/auth.routes";
import deviceTokenRoutes from "../src/deviceTokens/deviceToken.routes";
import goalRoutes from "../src/goals/goal.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/device-tokens", deviceTokenRoutes);
router.use("/goals", goalRoutes);

export default router;
