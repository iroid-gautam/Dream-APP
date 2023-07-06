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
router.post("/fcm/token", [authenticate, validator.body(storeFcmTokenDto)], registerPushToken);

router.use('/mentalState', authenticate, require('../src/mentalState/mentalStateRouter'));
router.use('/intention', authenticate, require('../src/myIntention/intentionRouter'));

router.use('/my', authenticate, require('../src/myMindBody&Inspiration/myRouter'));
router.use('/habit', authenticate, require('../src/myHabits/habitsRouter'));
router.use('/goal', authenticate, require('../src/myGoal/goalRouter'));
router.use('/journal', authenticate, require('../src/myJournal/journalRouter'));
router.use('/ourInsights', authenticate, require('../src/ourInsights/insightsRouter'));

export default router;