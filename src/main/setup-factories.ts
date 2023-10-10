import { authFactory } from "@features/auth/factories";
import { businessFactory } from "@features/business/factories";
import { Db } from "mongodb";

export function setupFactories(database: Db) {
  authFactory(database);
  businessFactory(database);
}
