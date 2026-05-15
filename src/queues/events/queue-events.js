import { QueueEvents } from "bullmq";
import logger from "../../common/logger";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";

const queueLogger = logger.withLabel("QUEUE_EVENTS");

const buildQueueEvents = (queueName) => {
  const events = new QueueEvents(queueName, {
    connection: redisConnection,
  });

  events.on("completed", ({ jobId }) => {
    queueLogger.info("Queue job completed.", {
      queueName,
      jobId,
    });
  });

  events.on("failed", ({ jobId, failedReason }) => {
    queueLogger.error("Queue job failed.", {
      queueName,
      jobId,
      failedReason,
    });
  });

  events.on("stalled", ({ jobId }) => {
    queueLogger.error("Queue job stalled.", {
      queueName,
      jobId,
    });
  });

  events.on("progress", ({ jobId, data }) => {
    queueLogger.info("Queue job progress.", {
      queueName,
      jobId,
      progress: data,
    });
  });

  events.on("error", (error) => {
    queueLogger.error("Queue events listener error.", {
      queueName,
      message: error.message,
    });
  });

  return events;
};

const registerQueueEvents = () => {
  return {
    generationScheduler: buildQueueEvents(QUEUE_NAMES.GENERATION_SCHEDULER),
    scriptGeneration: buildQueueEvents(QUEUE_NAMES.SCRIPT_GENERATION),
    audioGeneration: buildQueueEvents(QUEUE_NAMES.AUDIO_GENERATION),
    notificationDelivery: buildQueueEvents(QUEUE_NAMES.NOTIFICATION_DELIVERY),
  };
};

export default registerQueueEvents;
