import { Worker } from "bullmq";
import fs from "fs";
import path from "path";
import sequelize from "../../../model/connection";
import logger from "../../common/logger";
import constants from "../../common/constants/constant";
import CommonService from "../../common/services/common.service";
import CloudinaryAudioService from "../../services/storage/cloudinaryAudio.service";
import AudioValidatorService from "../../services/tts/audioValidator.service";
import ElevenLabsService from "../../services/tts/elevenlabs.service";
import TTSSanitizerService from "../../services/tts/ttsSanitizer.service";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { QUEUE_CONCURRENCY } from "../configs/queue-options";
import { addNotificationDeliveryJob } from "../producers/notificationDelivery.producer";

const queueLogger = logger.withLabel("QUEUE_AUDIO_WORKER");

const resolveDailyGenerationModel = () => {
  return sequelize.models.dailyGoalGeneration || null;
};

const ensureTempDirectory = () => {
  const tempDirectory = constants.AI_AUDIO_GENERATION.TEMP_DIRECTORY;
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true });
  }
  return tempDirectory;
};

const getTempAudioPath = ({ generationId }) => {
  const tempDirectory = ensureTempDirectory();
  return path.join(tempDirectory, `${generationId}.mp3`);
};

const removeTempFileIfExists = ({ filePath }) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
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

  const tempAudioPath = getTempAudioPath({ generationId });

  generation.generationStatus = "audio_processing";
  await generation.save();

  let audioMeta = generation.audio || {};
  const hasLocalTempFile = fs.existsSync(tempAudioPath);

  if (!hasLocalTempFile) {
    const sanitizedScript = TTSSanitizerService.sanitize(generation.script.text);
    if (!sanitizedScript) {
      throw new Error("Script text became empty after TTS sanitization.");
    }

    const ttsResult = await ElevenLabsService.generateSpeech({
      text: sanitizedScript,
    });

    if (!ttsResult.audioBuffer || !ttsResult.audioBuffer.length) {
      throw new Error("ElevenLabs returned empty audio buffer.");
    }

    fs.writeFileSync(tempAudioPath, ttsResult.audioBuffer);

    audioMeta = {
      ...audioMeta,
      provider: ttsResult.provider,
      voiceId: ttsResult.voiceId,
      modelId: ttsResult.modelId,
      tempFilePath: tempAudioPath,
    };
    generation.audio = audioMeta;
    await generation.save();
  }

  const validatedAudio = AudioValidatorService.validateTempAudioFile({
    filePath: tempAudioPath,
  });

  const uploadResult = await CloudinaryAudioService.uploadAudioFile({
    filePath: tempAudioPath,
    userId,
    goalId,
    generationDate: generation.generationDate,
  });

  generation.audio = {
    provider: audioMeta.provider || "elevenlabs",
    voiceId: audioMeta.voiceId || constants.AI_AUDIO_GENERATION.SINGLE_VOICE_ID,
    modelId: audioMeta.modelId || constants.AI_AUDIO_GENERATION.DEFAULT_MODEL_ID,
    cloudinaryPublicId: uploadResult.cloudinaryPublicId,
    audioUrl: uploadResult.audioUrl,
    duration: uploadResult.duration,
    format: uploadResult.format || validatedAudio.format,
    bytes: uploadResult.bytes || validatedAudio.bytes,
  };
  generation.generationStatus = "completed";
  generation.errorLogs = Array.isArray(generation.errorLogs)
    ? generation.errorLogs
    : [];
  await generation.save();
  removeTempFileIfExists({ filePath: tempAudioPath });

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
