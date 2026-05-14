import logger from "../logger";

const httpLogger = logger.withLabel("HTTP");

export default (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    httpLogger.info("HTTP request completed", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
    });
  });

  next();
};
