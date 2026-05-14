import express from "express";
import asyncWrapper from "express-async-wrapper";
import GoalController from "./goalController";
import authenticate from "../common/middlewares/authenticate";
import validator from "../common/config/joi-validator";
import createGoalDto from "./dtos/createGoal.dto";
import goalHistoryQueryDto from "./dtos/goalHistoryQuery.dto";
import getGodWhispersQueryDto from "./dtos/getGodWhispersQuery.dto";
import toggleGoalReminderDto from "./dtos/toggleGoalReminder.dto";

const router = express.Router();

router.get(
  "/whispers",
  validator.query(getGodWhispersQueryDto),
  asyncWrapper(GoalController.getGodWhispers)
);

router.post(
  "/",
  authenticate,
  validator.body(createGoalDto),
  asyncWrapper(GoalController.create)
);

router.get(
  "/summary",
  authenticate,
  validator.query(goalHistoryQueryDto),
  asyncWrapper(GoalController.getSummary)
);

router.patch(
  "/:id/reminder",
  authenticate,
  validator.body(toggleGoalReminderDto),
  asyncWrapper(GoalController.toggleReminder)
);

export default router;
