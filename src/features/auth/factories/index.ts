import { myAppUserFactory } from "./app-user.factory";
import { Db } from "mongodb";

export function authFactory(db?: Db) {
  const appUserFactory = myAppUserFactory(db);
  return {
    appUserFactory,
  };
}
