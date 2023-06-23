import express from "express";
import authRoutes from "../src/auth/auth.routes";
import authenticate from "../src/common/middlewares/authenticate";
import storeFcmTokenDto from "../src/fcmToken/dtos/storeFcmToken.dto";
import validator from "../src/common/config/joi-validator";
import registerPushToken from "../src/fcmToken/token.controller";
import userRoutes from "../src/user/user.routes";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/user", authenticate, userRoutes);

router.use('/mentalState', authenticate, require('../src/mentalState/mentalStateRouter'));

router.post("/fcm/token", [authenticate, validator.body(storeFcmTokenDto)], registerPushToken);

export default router;