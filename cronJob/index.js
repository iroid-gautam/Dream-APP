import cron from "node-cron";
import logger from "../src/common/logger";
import { runReminderDispatch } from "./reminderNotification.job";
import { registerDailyGenerationScheduler } from "../src/queues/schedulers/dailyGeneration.scheduler";

const reminderLogger = logger.withLabel("REMINDER_JOB");
const timezone = process.env.REMINDER_JOB_TIMEZONE || "UTC";

// Every minute check due goal reminders.
cron.schedule(
  "* * * * *",
  async () => {
    reminderLogger.info("Reminder cron tick started.");
    try {
      await runReminderDispatch();
    } catch (error) {
      reminderLogger.error("Reminder cron tick failed.", {
        message: error?.message || "Unknown error",
        stack: error?.stack || null,
      });
    }
  },
  {
    scheduled: true,
    timezone,
  }
);

reminderLogger.info("Reminder notification cron started.", {
  schedule: "* * * * *",
  timezone,
});

registerDailyGenerationScheduler().catch((error) => {
  reminderLogger.error("Failed to register daily generation scheduler.", {
    message: error?.message || "Unknown error",
    stack: error?.stack || null,
  });
});
