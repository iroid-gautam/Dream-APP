import fs from "fs";
import path from "path";
import util from "util";
import winston from "winston";

const env = `${process.env.NODE_ENV || process.env.ENV || ""}`.toLowerCase();
const isDevelopment = env === "development" || env === "local";
const logsDir = path.join(process.cwd(), "logs");

winston.addColors({
  error: "bold red",
  warn: "yellow",
  info: "green",
  http: "cyan",
  verbose: "magenta",
  debug: "blue",
  silly: "gray",
});

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, errors, printf, json, colorize } = winston.format;
const separatorLine = "=".repeat(100);

const consoleFormat = printf(
  ({ level, message, timestamp: time, label, service, environment, stack, ...meta }) => {
    const metaKeys = Object.keys(meta || {});
    const labelText = label ? `[${label}] ` : "";
    const extra = metaKeys.length > 0
      ? `\nmeta ${util.inspect(meta, {
        colors: true,
        depth: 5,
        compact: false,
      })}`
      : "";

    return `[${time}] ${level} ${labelText}${message}${stack ? `\n${stack}` : ""}${extra}\n${separatorLine}`;
  }
);

const transports = [
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      consoleFormat
    ),
  }),
  new winston.transports.File({
    filename: path.join(logsDir, "app.log"),
    level: "info",
    format: combine(timestamp(), errors({ stack: true }), json()),
  }),
  new winston.transports.File({
    filename: path.join(logsDir, "error.log"),
    level: "error",
    format: combine(timestamp(), errors({ stack: true }), json()),
  }),
];

const logger = winston.createLogger({
  level: isDevelopment ? "debug" : "info",
  defaultMeta: {
    service: "sequalize-crud",
    environment: env || "unknown",
  },
  transports,
});

logger.withLabel = (label) => ({
  error: (message, meta = {}) => logger.error(message, { label, ...meta }),
  warn: (message, meta = {}) => logger.warn(message, { label, ...meta }),
  info: (message, meta = {}) => logger.info(message, { label, ...meta }),
  http: (message, meta = {}) => logger.http(message, { label, ...meta }),
  verbose: (message, meta = {}) => logger.verbose(message, { label, ...meta }),
  debug: (message, meta = {}) => logger.debug(message, { label, ...meta }),
});

export { isDevelopment };
export default logger;
