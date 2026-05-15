import { Queue } from "bullmq";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { AUDIO_JOB_OPTIONS } from "../configs/queue-options";

const audioGenerationQueue = new Queue(QUEUE_NAMES.AUDIO_GENERATION, {
  connection: redisConnection,
  defaultJobOptions: AUDIO_JOB_OPTIONS,
});

export const addAudioGenerationJob = async ({ generationId, goalId, userId }) => {
  return audioGenerationQueue.add(
    "audio-generation-run",
    {
      generationId,
      goalId,
      userId,
    },
    {
      jobId: `audio-generation:${generationId}`,
    }
  );
};

export default audioGenerationQueue;
