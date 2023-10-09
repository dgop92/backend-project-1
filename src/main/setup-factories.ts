import { authFactory } from "@features/auth/factories";
import { Db } from "mongodb";

export function setupFactories(database: Db) {
  authFactory(database);
}
