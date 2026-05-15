import { Worker } from "bullmq";
import { Op } from "sequelize";
import sequelize from "../../../model/connection";
import logger from "../../common/logger";
import CommonService from "../../common/services/common.service";
import InputSanitizerService from "../../services/ai/inputSanitizer.service";
import OpenAIService from "../../services/ai/openai.service";
import PromptBuilderService from "../../services/ai/promptBuilder.service";
import ResponseValidatorService from "../../services/ai/responseValidator.service";
import ToneRotationService from "../../services/ai/toneRotation.service";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { QUEUE_CONCURRENCY } from "../configs/queue-options";
import { addAudioGenerationJob } from "../producers/audioGeneration.producer";

const queueLogger = logger.withLabel("QUEUE_SCRIPT_WORKER");

const resolveDailyGenerationModel = () => {
  return sequelize.models.dailyGoalGeneration || null;
};

const resolveGoalModel = () => {
  return sequelize.models.goal || null;
};

const resolveGodWhisperModel = () => {
  return sequelize.models.godWhisper || null;
};

const fetchGoalScriptInput = async ({ goalId }) => {
  const Goal = resolveGoalModel();
  const GodWhisper = resolveGodWhisperModel();

  if (!Goal) {
    throw new Error("goal model not registered.");
  }

  const goal = await CommonService.findByPk(Goal, goalId);
  if (!goal) {
    throw new Error("Goal not found for script generation.");
  }

  const whisperIds = Array.isArray(goal.godWhisperIds) ? goal.godWhisperIds : [];
  let whisperMessages = [];

  if (GodWhisper && whisperIds.length) {
    const whispers = await CommonService.findAll(GodWhisper, {
      where: {
        id: {
          [Op.in]: whisperIds,
        },
        isActive: true,
      },
      attributes: ["id", "message"],
    });

    const byId = new Map(whispers.map((entry) => [entry.id, entry.message]));
    whisperMessages = whisperIds
      .map((id) => byId.get(id))
      .filter((message) => typeof message === "string" && message.trim());
  }

  return {
    username: goal.username,
    dream: goal.dream,
    godWhispers: whisperMessages,
    preferredLanguage: goal.preferredLanguage || "en",
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

  const goalInput = await fetchGoalScriptInput({ goalId });
  const sanitizedInput = InputSanitizerService.sanitizeGoalInput(goalInput);
  const tone = ToneRotationService.resolveTone({
    generationDate: generation.generationDate,
  });
  const prompts = PromptBuilderService.buildPrompts({
    ...sanitizedInput,
    tone,
  });

  const scriptResult = await OpenAIService.generateMotivationScript({
    systemPrompt: prompts.systemPrompt,
    userPrompt: prompts.userPrompt,
  });

  const validatedText = ResponseValidatorService.validateScript({
    text: scriptResult.text,
  });

  generation.script = {
    text: validatedText,
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
