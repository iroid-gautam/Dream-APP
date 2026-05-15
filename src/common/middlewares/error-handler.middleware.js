import logger from "../logger";

const errorLogger = logger.withLabel("ERROR");

export default (err, req, res, next) => {
  errorLogger.error("Request failed.", {
    method: req.method,
    url: req.originalUrl,
    statusCode: err?.statusCode || 500,
    message: err?.message || "Unknown error",
    stack: err?.stack || null,
  });

  if (err && err.error && err.error.isJoi) {
    return res.status(422).json({
      success: false,
      message: err.error.details[0].message,
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message,
  });
};
