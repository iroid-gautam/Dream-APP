import cron from "node-cron";
import logger from "../src/common/logger";
import { runReminderDispatch } from "./reminderNotification.job";

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
