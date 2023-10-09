import { AppUser } from "@features/auth/entities/app-user";
import { Db } from "mongodb";

export type AppUserDocument = Omit<AppUser, "id">;

export function getAppUserCollection(database: Db) {
  return database.collection<AppUserDocument>("users");
}
