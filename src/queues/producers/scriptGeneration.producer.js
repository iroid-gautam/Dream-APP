import { Queue } from "bullmq";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { DEFAULT_JOB_OPTIONS } from "../configs/queue-options";

const scriptGenerationQueue = new Queue(QUEUE_NAMES.SCRIPT_GENERATION, {
  connection: redisConnection,
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

export const addScriptGenerationJob = async ({
  generationId,
  goalId,
  userId,
  delayMs = 0,
}) => {
  const safeDelayMs = Number(delayMs) > 0 ? Number(delayMs) : 0;

  return scriptGenerationQueue.add(
    "script-generation-run",
    {
      generationId,
      goalId,
      userId,
    },
    {
      jobId: `script-generation:${generationId}`,
      delay: safeDelayMs,
    }
  );
};

export default scriptGenerationQueue;
