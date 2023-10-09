import {
  getOsEnv,
  getOsEnvOrDefault,
  parseIntOrThrow,
  parseListOrDefault,
} from "./env-utils";

export const APP_ENV_VARS = {
  NODE_ENV: getOsEnv("NODE_ENV"),
  isProduction: getOsEnv("NODE_ENV") === "prod",
  isTest: getOsEnv("NODE_ENV") === "test",
  port: parseIntOrThrow(process.env.PORT || getOsEnv("APP_PORT")),
  logging: {
    level: getOsEnvOrDefault("LOG_LEVEL", "info"),
  },
  db: {
    mongoUrl: getOsEnv("MONGO_URL"),
    databaseName: getOsEnv("MONGO_DB_NAME"),
  },
  cors: {
    allowOrigins: parseListOrDefault(
      getOsEnvOrDefault("CORS_ALLOW_ORIGINS", ""),
      "*"
    ),
  },
};
