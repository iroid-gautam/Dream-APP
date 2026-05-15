import { Worker } from "bullmq";
import sequelize from "../../../model/connection";
import logger from "../../common/logger";
import CommonService from "../../common/services/common.service";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { QUEUE_CONCURRENCY } from "../configs/queue-options";
import { addNotificationDeliveryJob } from "../producers/notificationDelivery.producer";

const queueLogger = logger.withLabel("QUEUE_AUDIO_WORKER");

const resolveDailyGenerationModel = () => {
  return sequelize.models.dailyGoalGeneration || null;
};

const generateAudioFromScript = async ({ scriptText }) => {
  return {
    audioBufferBase64: Buffer.from(scriptText || "motivation-audio").toString(
      "base64"
    ),
    provider: "mock-elevenlabs",
    voiceId: process.env.DEFAULT_TTS_VOICE_ID || "default-voice",
    duration: 30,
  };
};

const uploadAudioToStorage = async ({ generationId }) => {
  return {
    cloudinaryPublicId: `mock/audio/${generationId}`,
    audioUrl: `https://example.com/mock-audio/${generationId}.mp3`,
  };
};

const processAudioJob = async (job) => {
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

  if (generation.audio?.audioUrl) {
    await addNotificationDeliveryJob({ generationId, goalId, userId });
    return { skipped: true, reason: "audio_already_exists" };
  }

  if (!generation.script?.text) {
    throw new Error("Script text missing for audio generation.");
  }

  generation.generationStatus = "audio_processing";
  await generation.save();

  const audioResult = await generateAudioFromScript({
    scriptText: generation.script.text,
  });
  const uploadResult = await uploadAudioToStorage({ generationId });

  generation.audio = {
    provider: audioResult.provider,
    voiceId: audioResult.voiceId,
    cloudinaryPublicId: uploadResult.cloudinaryPublicId,
    audioUrl: uploadResult.audioUrl,
    duration: audioResult.duration,
  };
  generation.generationStatus = "completed";
  generation.errorLogs = Array.isArray(generation.errorLogs)
    ? generation.errorLogs
    : [];
  await generation.save();

  await addNotificationDeliveryJob({ generationId, goalId, userId });

  return {
    generationId,
    generationStatus: generation.generationStatus,
  };
};

const audioGenerationWorker = new Worker(
  QUEUE_NAMES.AUDIO_GENERATION,
  async (job) => {
    const startedAt = Date.now();
    queueLogger.info("Audio worker job started.", {
      jobId: job.id,
      name: job.name,
      generationId: job.data?.generationId,
    });

    const result = await processAudioJob(job);

    queueLogger.info("Audio worker job completed.", {
      jobId: job.id,
      name: job.name,
      generationId: job.data?.generationId,
      durationMs: Date.now() - startedAt,
      skipped: !!result?.skipped,
      reason: result?.reason,
    });

    return result;
  },
  {
    connection: redisConnection,
    concurrency: QUEUE_CONCURRENCY.AUDIO_GENERATION,
  }
);

audioGenerationWorker.on("failed", async (job, error) => {
  const DailyGoalGeneration = resolveDailyGenerationModel();

  if (DailyGoalGeneration && job?.data?.generationId) {
    const generation = await CommonService.findByPk(
      DailyGoalGeneration,
      job.data.generationId
    );

    if (generation) {
      generation.generationStatus = "failed";
      generation.retryCount = Number(generation.retryCount || 0) + 1;
      const logs = Array.isArray(generation.errorLogs) ? generation.errorLogs : [];
      logs.push({
        step: "audio_generation",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      generation.errorLogs = logs;
      await generation.save();
    }
  }

  queueLogger.error("Audio worker job failed.", {
    jobId: job?.id,
    name: job?.name,
    generationId: job?.data?.generationId,
    message: error.message,
  });
});

export default audioGenerationWorker;
