import { Queue } from "bullmq";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { DEFAULT_JOB_OPTIONS } from "../configs/queue-options";

const notificationDeliveryQueue = new Queue(QUEUE_NAMES.NOTIFICATION_DELIVERY, {
  connection: redisConnection,
  defaultJobOptions: DEFAULT_JOB_OPTIONS,
});

export const addNotificationDeliveryJob = async ({
  generationId,
  goalId,
  userId,
}) => {
  return notificationDeliveryQueue.add(
    "notification-delivery-run",
    {
      generationId,
      goalId,
      userId,
    },
    {
      jobId: `notification-delivery:${generationId}`,
    }
  );
};

export default notificationDeliveryQueue;
