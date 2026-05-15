const getQueueNumber = (envKey, fallback) => {
  const parsed = Number(process.env[envKey]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const DEFAULT_JOB_OPTIONS = {
  attempts: getQueueNumber("QUEUE_DEFAULT_ATTEMPTS", 3),
  backoff: {
    type: "exponential",
    delay: getQueueNumber("QUEUE_DEFAULT_BACKOFF_DELAY_MS", 5000),
  },
  removeOnComplete: true,
  removeOnFail: false,
};

export const QUEUE_CONCURRENCY = {
  GENERATION_SCHEDULER: getQueueNumber("QUEUE_CONCURRENCY_SCHEDULER", 1),
  SCRIPT_GENERATION: getQueueNumber("QUEUE_CONCURRENCY_SCRIPT", 5),
  AUDIO_GENERATION: getQueueNumber("QUEUE_CONCURRENCY_AUDIO", 3),
  NOTIFICATION_DELIVERY: getQueueNumber("QUEUE_CONCURRENCY_NOTIFICATION", 20),
};
