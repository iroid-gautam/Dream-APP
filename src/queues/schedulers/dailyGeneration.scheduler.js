import logger from "../../common/logger";
import generationSchedulerQueue from "../producers/generationScheduler.producer";

const queueLogger = logger.withLabel("QUEUE_SCHEDULER");

const SCHEDULER_JOB_NAME = "generation-scheduler-run";
const SCHEDULER_REPEAT_EVERY_MS = Number(
  process.env.GENERATION_SCHEDULER_REPEAT_MS || 60 * 1000
);

export const registerDailyGenerationScheduler = async () => {
  const repeatJob = await generationSchedulerQueue.add(
    SCHEDULER_JOB_NAME,
    {
      trigger: "repeatable-scheduler",
      runAt: new Date().toISOString(),
    },
    {
      jobId: "generation-scheduler-repeatable",
      repeat: {
        every: SCHEDULER_REPEAT_EVERY_MS,
      },
    }
  );

  queueLogger.info("Daily generation scheduler registered.", {
    jobName: SCHEDULER_JOB_NAME,
    repeatEveryMs: SCHEDULER_REPEAT_EVERY_MS,
    repeatJobKey: repeatJob.repeatJobKey,
  });

  return repeatJob;
};

export default registerDailyGenerationScheduler;
