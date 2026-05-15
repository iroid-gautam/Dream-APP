import { Worker } from "bullmq";
import sequelize from "../../../model/connection";
import logger from "../../common/logger";
import CommonService from "../../common/services/common.service";
import PushNotificationService from "../../common/services/pushNotification.service";
import DeviceTokenService from "../../deviceTokens/deviceTokenService";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { QUEUE_CONCURRENCY } from "../configs/queue-options";

const queueLogger = logger.withLabel("QUEUE_NOTIFICATION_WORKER");

const resolveDailyGenerationModel = () => {
  return sequelize.models.dailyGoalGeneration || null;
};

const buildNotificationMessage = (generation) => {
  const scriptText = generation?.script?.text || "";
  const bodyPreview = scriptText.length > 80 ? `${scriptText.slice(0, 77)}...` : scriptText;

  return {
    title: "Daily Motivation Ready",
    body: bodyPreview || "Your daily motivation audio is ready.",
  };
};

const processNotificationJob = async (job) => {
  const DailyGoalGeneration = resolveDailyGenerationModel();
  if (!DailyGoalGeneration) {
    queueLogger.warn("dailyGoalGeneration model not registered. Skipping job.", {
      jobId: job.id,
    });
    return { skipped: true, reason: "daily_goal_generation_model_missing" };
  }

  const { generationId, goalId, userId } = job.data;
  const generation = await CommonService.findByPk(DailyGoalGeneration, generationId);

  if (!generation) {
    queueLogger.warn("Generation record not found. Skipping job.", {
      jobId: job.id,
      generationId,
    });
    return { skipped: true, reason: "generation_not_found" };
  }

  if (generation.delivered) {
    return { skipped: true, reason: "already_delivered" };
  }

  if (generation.generationStatus !== "completed") {
    return { skipped: true, reason: "generation_not_completed" };
  }

  const tokens = await DeviceTokenService.getActiveTokensByUserIds([userId]);
  const tokenValues = tokens.map((entry) => entry.fcmToken).filter(Boolean);

  if (!tokenValues.length) {
    return { skipped: true, reason: "no_active_device_tokens" };
  }

  const sendResult = await PushNotificationService.sendMulticast({
    tokens: tokenValues,
    notification: buildNotificationMessage(generation),
    data: {
      type: "daily_motivation_ready",
      goalId: `${goalId || ""}`,
      generationId,
      eventVersion: "v1",
    },
  });

  if (sendResult.invalidTokens.length) {
    await DeviceTokenService.markTokensInactiveByValue(sendResult.invalidTokens);
  }

  generation.delivered = sendResult.successCount > 0;
  generation.deliveredAt = sendResult.successCount > 0 ? new Date() : null;
  await generation.save();

  return {
    generationId,
    delivered: generation.delivered,
    successCount: sendResult.successCount,
    failureCount: sendResult.failureCount,
  };
};

const notificationDeliveryWorker = new Worker(
  QUEUE_NAMES.NOTIFICATION_DELIVERY,
  async (job) => {
    const startedAt = Date.now();
    queueLogger.info("Notification worker job started.", {
      jobId: job.id,
      name: job.name,
      generationId: job.data?.generationId,
    });

    const result = await processNotificationJob(job);

    queueLogger.info("Notification worker job completed.", {
      jobId: job.id,
      name: job.name,
      generationId: job.data?.generationId,
      durationMs: Date.now() - startedAt,
      skipped: !!result?.skipped,
      reason: result?.reason,
      delivered: result?.delivered,
      successCount: result?.successCount,
      failureCount: result?.failureCount,
    });

    return result;
  },
  {
    connection: redisConnection,
    concurrency: QUEUE_CONCURRENCY.NOTIFICATION_DELIVERY,
  }
);

notificationDeliveryWorker.on("failed", async (job, error) => {
  const DailyGoalGeneration = resolveDailyGenerationModel();

  if (DailyGoalGeneration && job?.data?.generationId) {
    const generation = await CommonService.findByPk(
      DailyGoalGeneration,
      job.data.generationId
    );

    if (generation) {
      const logs = Array.isArray(generation.errorLogs) ? generation.errorLogs : [];
      logs.push({
        step: "notification_delivery",
        goalId: job?.data?.goalId,
        userId: job?.data?.userId,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      generation.errorLogs = logs;
      generation.retryCount = Number(generation.retryCount || 0) + 1;
      await generation.save();
    }
  }

  queueLogger.error("Notification worker job failed.", {
    jobId: job?.id,
    name: job?.name,
    generationId: job?.data?.generationId,
    message: error.message,
  });
});

export default notificationDeliveryWorker;
