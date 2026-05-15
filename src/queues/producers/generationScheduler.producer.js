import { Queue } from "bullmq";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { DEFAULT_JOB_OPTIONS } from "../configs/queue-options";

const generationSchedulerQueue = new Queue(QUEUE_NAMES.GENERATION_SCHEDULER, {
  connection: redisConnection,
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

export const addGenerationSchedulerJob = async ({
  trigger = "cron",
  runAt = new Date().toISOString(),
} = {}) => {
  return generationSchedulerQueue.add(
    "generation-scheduler-run",
    {
      trigger,
      runAt,
    },
    {
      jobId: `generation-scheduler-${runAt}`,
    }
  );
};

export default generationSchedulerQueue;
