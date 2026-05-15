import IORedis from "ioredis";
import logger from "../../common/logger";

const queueLogger = logger.withLabel("QUEUE");

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB || 0),
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redisConnection.on("connect", () => {
  queueLogger.info("Redis connection established for queues.", {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    db: Number(process.env.REDIS_DB || 0),
  });
});

redisConnection.on("error", (error) => {
  queueLogger.error("Redis connection error.", {
    message: error.message,
  });
});

export default redisConnection;
