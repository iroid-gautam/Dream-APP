import { Worker } from "bullmq";
import sequelize from "../../../model/connection";
import logger from "../../common/logger";
import CommonService from "../../common/services/common.service";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { QUEUE_CONCURRENCY } from "../configs/queue-options";
import { addAudioGenerationJob } from "../producers/audioGeneration.producer";

const queueLogger = logger.withLabel("QUEUE_SCRIPT_WORKER");

const resolveDailyGenerationModel = () => {
  return sequelize.models.dailyGoalGeneration || null;
};

const generateScriptFromGoal = async ({ goalId, userId }) => {
  const fallbackScript =
    process.env.DEVELOPMENT_SCRIPT_TEXT ||
    "Stay focused on your goal today. You are making progress.";

  return {
    text: fallbackScript,
    provider: "mock",
    model: "mock-model-v1",
    meta: {
      goalId,
      userId,
      source: "fallback",
    },
  };
};

const processScriptJob = async (job) => {
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

  if (generation.script?.text) {
    await addAudioGenerationJob({ generationId, goalId, userId });
    return { skipped: true, reason: "script_already_exists" };
  }

  generation.generationStatus = "script_processing";
  await generation.save();

  const scriptResult = await generateScriptFromGoal({ goalId, userId });

  generation.script = {
    text: scriptResult.text,
    provider: scriptResult.provider,
    model: scriptResult.model,
  };
  generation.generationStatus = "script_completed";
  generation.errorLogs = Array.isArray(generation.errorLogs)
    ? generation.errorLogs
    : [];
  await generation.save();

  await addAudioGenerationJob({ generationId, goalId, userId });

  return {
    generationId,
    generationStatus: generation.generationStatus,
  };
};

const scriptGenerationWorker = new Worker(
  QUEUE_NAMES.SCRIPT_GENERATION,
  async (job) => {
    const startedAt = Date.now();
    queueLogger.info("Script worker job started.", {
      jobId: job.id,
      name: job.name,
      generationId: job.data?.generationId,
    });

    const result = await processScriptJob(job);

    queueLogger.info("Script worker job completed.", {
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
    concurrency: QUEUE_CONCURRENCY.SCRIPT_GENERATION,
  }
);

scriptGenerationWorker.on("failed", async (job, error) => {
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
        step: "script_generation",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      generation.errorLogs = logs;
      await generation.save();
    }
  }

  queueLogger.error("Script worker job failed.", {
    jobId: job?.id,
    name: job?.name,
    generationId: job?.data?.generationId,
    message: error.message,
  });
});

export default scriptGenerationWorker;
