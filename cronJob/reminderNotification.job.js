import Goal from "../model/goal";
import User from "../model/user";
import DeviceTokenService from "../src/deviceTokens/deviceTokenService";
import PushNotificationService from "../src/common/services/pushNotification.service";
import CommonService from "../src/common/services/common.service";
import { resolveSafeTimezone } from "../src/common/helper";
import logger from "../src/common/logger";

const reminderLogger = logger.withLabel("REMINDER_JOB");

const getLocalDateTimeParts = (timeZone) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const data = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      data[part.type] = part.value;
    }
  });

  return {
    date: `${data.year}-${data.month}-${data.day}`,
    time: `${data.hour}:${data.minute}`,
  };
};

const shouldSendReminderNow = (goal) => {
  if (!goal.reminderEnabled || !goal.isActive) {
    return false;
  }

  const timezone = resolveSafeTimezone(goal.user?.timezone, "UTC");
  const localNow = getLocalDateTimeParts(timezone);

  if (goal.reminderTime !== localNow.time) {
    return false;
  }

  if (!goal.lastReminderSentAt) {
    return true;
  }

  const lastSentLocal = getLocalDateTimeParts(timezone);
  const lastSentAt = new Date(goal.lastReminderSentAt);
  const lastSentParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(lastSentAt);

  const mapped = {};
  lastSentParts.forEach((part) => {
    if (part.type !== "literal") {
      mapped[part.type] = part.value;
    }
  });

  const lastSentDate = `${mapped.year}-${mapped.month}-${mapped.day}`;
  const lastSentTime = `${mapped.hour}:${mapped.minute}`;

  return !(lastSentDate === lastSentLocal.date && lastSentTime === lastSentLocal.time);
};

const runReminderDispatch = async () => {
  reminderLogger.info("Reminder dispatch cycle started.");

  const goals = await CommonService.findAll(Goal, {
    where: {
      isActive: true,
      reminderEnabled: true,
    },
    attributes: [
      "id",
      "userId",
      "username",
      "dream",
      "reminderTime",
      "lastReminderSentAt",
      "isActive",
      "reminderEnabled",
    ],
    include: [
      {
        model: User,
        as: "user",
        required: true,
        attributes: ["id", "timezone", "isDeleted"],
        where: {
          isDeleted: false,
        },
      },
    ],
  });

  const dueGoals = goals.filter(shouldSendReminderNow);

  if (!dueGoals.length) {
    reminderLogger.info("No due goals for reminder dispatch.", {
      activeReminderGoalsCount: goals.length,
    });
    return;
  }

  const userIds = dueGoals.map((goal) => goal.userId);
  const activeTokens = await DeviceTokenService.getActiveTokensByUserIds(userIds);
  const tokenMap = new Map();

  activeTokens.forEach((entry) => {
    if (!tokenMap.has(entry.userId)) {
      tokenMap.set(entry.userId, []);
    }

    tokenMap.get(entry.userId).push(entry.fcmToken);
  });

  for (const goal of dueGoals) {
    const tokens = tokenMap.get(goal.userId) || [];

    if (!tokens.length) {
      continue;
    }

    const sendResult = await PushNotificationService.sendMulticast({
      tokens,
      notification: {
        title: "Goal Reminder",
        body: `${goal.username}, remember your goal: ${goal.dream}`,
      },
      data: {
        type: "goal_reminder",
        goalId: goal.id,
      },
    });

    if (sendResult.invalidTokens.length) {
      await DeviceTokenService.markTokensInactiveByValue(sendResult.invalidTokens);
    }

    goal.lastReminderSentAt = new Date();
    await goal.save();
  }

  reminderLogger.info("Reminder dispatch cycle completed.", {
    activeReminderGoalsCount: goals.length,
    dueGoalCount: dueGoals.length,
  });
};

export { runReminderDispatch };
