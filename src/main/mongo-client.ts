import { APP_ENV_VARS } from "@common/config/app-env-vars";
import { MongoClient, Db } from "mongodb";
import { AppLogger } from "@common/logging/logger";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

let mongoDatabase: Db;
let mongoClient: MongoClient;

export async function getMongoDatabase() {
  if (mongoClient === undefined) {
    mongoClient = new MongoClient(APP_ENV_VARS.db.mongoUrl);
  }

  myLogger.info("connecting to mongodb");
  await mongoClient.connect();
  myLogger.info("connected to mongodb");

  if (mongoClient && mongoDatabase === undefined) {
    mongoDatabase = mongoClient.db(APP_ENV_VARS.db.databaseName);
  }

  return {
    mongoClient,
    mongoDatabase,
  };
}

export function closeMongoConnection() {
  if (mongoClient) {
    mongoClient.close();
  }
}
