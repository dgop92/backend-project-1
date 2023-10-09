import { ILogger } from "./logger";
import winston from "winston";
import { APP_ENV_VARS } from "@common/config/app-env-vars";
const winsFormat = winston.format;

export class WinstonLogger implements ILogger {
  constructor(private readonly logger: winston.Logger) {}

  fatal(message: string, meta: { [key: string]: any } = {}) {
    this.logger.log("fatal", message, meta);
  }

  error(message: string, meta: { [key: string]: any } = {}) {
    this.logger.log("error", message, meta);
  }

  warn(message: string, meta: { [key: string]: any } = {}) {
    this.logger.log("warn", message, meta);
  }

  info(message: string, meta: { [key: string]: any } = {}) {
    this.logger.log("info", message, meta);
  }

  http(message: string, meta: { [key: string]: any } = {}) {
    this.logger.log("http", message, meta);
  }

  debug(message: string, meta: { [key: string]: any } = {}) {
    this.logger.log("debug", message, meta);
  }
}

const MY_CUSTOM_LEVELS = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "magenta",
    debug: "gray",
  },
};

export function createDevLogger() {
  const myFormat = winsFormat.printf(
    ({ level, message, metadata, timestamp }) => {
      const metadataAsString = JSON.stringify(metadata);
      const filename = metadata.filename;
      return filename
        ? `${timestamp} ${level}: [${filename}] ${message} ${metadataAsString}`
        : `${timestamp} ${level}: ${message} ${metadataAsString}`;
    }
  );

  const logger = winston.createLogger({
    level: APP_ENV_VARS.logging.level,
    levels: MY_CUSTOM_LEVELS.levels,
    format: winsFormat.combine(
      winsFormat.colorize(),
      winsFormat.metadata(),
      winsFormat.timestamp(),
      myFormat
    ),
    transports: [new winston.transports.Console()],
  });

  winston.addColors(MY_CUSTOM_LEVELS.colors);
  return logger;
}

export function createTestLogger() {
  return createDevLogger();
}
