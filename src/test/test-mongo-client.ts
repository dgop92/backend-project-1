import { APP_ENV_VARS } from "@common/config/app-env-vars";
import { MongoClient, Db } from "mongodb";

let mongoDatabase: Db;
let mongoClient: MongoClient;

export function getMongoTestDatabase() {
  if (mongoClient === undefined) {
    mongoClient = new MongoClient(APP_ENV_VARS.db.mongoUrl);
  }
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
