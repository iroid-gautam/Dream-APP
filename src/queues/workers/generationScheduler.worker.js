import { Worker } from "bullmq";
import Goal from "../../../model/goal";
import User from "../../../model/user";
import sequelize from "../../../model/connection";
import logger from "../../common/logger";
import { resolveSafeTimezone } from "../../common/helper";
import CommonService from "../../common/services/common.service";
import redisConnection from "../connections/redis.connection";
import QUEUE_NAMES from "../configs/queue-names";
import { QUEUE_CONCURRENCY } from "../configs/queue-options";
import { addScriptGenerationJob } from "../producers/scriptGeneration.producer";

const queueLogger = logger.withLabel("QUEUE_SCHEDULER_WORKER");
const GENERATION_BUFFER_MINUTES = Number(
  process.env.GENERATION_BUFFER_MINUTES || 30
);
const GENERATION_JITTER_MAX_SECONDS = Number(
  process.env.GENERATION_JITTER_MAX_SECONDS || 0
);

const getLocalTimeParts = (timeZone, date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const mapped = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      mapped[part.type] = part.value;
    }
  });

  return {
    date: `${mapped.year}-${mapped.month}-${mapped.day}`,
    time: `${mapped.hour}:${mapped.minute}`,
  };
};

const getQueueTargetTime = (date = new Date()) => {
  return new Date(date.getTime() + GENERATION_BUFFER_MINUTES * 60 * 1000);
};

const buildGenerationDateIso = (timeZone, now = new Date()) => {
  const local = getLocalTimeParts(timeZone || "UTC", now);
  return new Date(`${local.date}T00:00:00.000Z`).toISOString();
};

const resolveDailyGenerationModel = () => {
  return sequelize.models.dailyGoalGeneration || null;
};

const ensureDailyGenerationAndQueue = async (goal) => {
  const DailyGoalGeneration = resolveDailyGenerationModel();

  if (!DailyGoalGeneration) {
    queueLogger.warn("dailyGoalGeneration model not registered. Skipping job.", {
      goalId: goal.id,
    });
    return;
  }

  const timezone = resolveSafeTimezone(goal.user?.timezone, "UTC");
  const generationDate = buildGenerationDateIso(timezone);
  const existing = await CommonService.findOne(DailyGoalGeneration, {
    goalId: goal.id,
    generationDate,
  });

  if (existing) {
    return;
  }

  const generation = await CommonService.createOne(DailyGoalGeneration, {
    goalId: goal.id,
    userId: goal.userId,
    generationDate,
    generationStatus: "pending",
    retryCount: 0,
    delivered: false,
    errorLogs: [],
  });

  const jitterMaxMs = Math.max(0, GENERATION_JITTER_MAX_SECONDS) * 1000;
  const jitterDelayMs =
    jitterMaxMs > 0 ? Math.floor(Math.random() * (jitterMaxMs + 1)) : 0;

  await addScriptGenerationJob({
    generationId: generation.id,
    goalId: goal.id,
    userId: goal.userId,
    delayMs: jitterDelayMs,
  });
};

const processSchedulerJob = async () => {
  const target = getQueueTargetTime();

  const goals = await CommonService.findAll(Goal, {
    where: {
      isActive: true,
      reminderEnabled: true,
    },
    attributes: ["id", "userId", "reminderTime"],
    include: [
      {
        model: User,
        as: "user",
        required: true,
        attributes: ["id", "timezone", "isDeleted"],
        where: {
          isDeleted: false,
        },
      },
    ],
  });

  const eligibleGoals = goals.filter((goal) => {
    const timezone = resolveSafeTimezone(goal.user?.timezone, "UTC");
    const targetLocal = getLocalTimeParts(timezone, target);
    return goal.reminderTime === targetLocal.time;
  });

  for (const goal of eligibleGoals) {
    await ensureDailyGenerationAndQueue(goal);
  }

  return {
    scannedGoals: goals.length,
    eligibleGoals: eligibleGoals.length,
  };
};

const generationSchedulerWorker = new Worker(
  QUEUE_NAMES.GENERATION_SCHEDULER,
  async (job) => {
    const startedAt = Date.now();
    queueLogger.info("Scheduler worker job started.", {
      jobId: job.id,
      name: job.name,
    });

    const result = await processSchedulerJob();

    queueLogger.info("Scheduler worker job completed.", {
      jobId: job.id,
      name: job.name,
      durationMs: Date.now() - startedAt,
      scannedGoals: result.scannedGoals,
      eligibleGoals: result.eligibleGoals,
    });

    return result;
  },
  {
    connection: redisConnection,
    concurrency: QUEUE_CONCURRENCY.GENERATION_SCHEDULER,
  }
);

generationSchedulerWorker.on("failed", (job, error) => {
  queueLogger.error("Scheduler worker job failed.", {
    jobId: job?.id,
    name: job?.name,
    message: error.message,
  });
});

export default generationSchedulerWorker;
