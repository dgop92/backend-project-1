import { myAppUserFactory } from "./app-user.factory";
import { Db } from "mongodb";
import { myAuthUserFactory } from "./auth-user.factory";
import { myUserServiceFactory } from "./user-service-factory";

export function authFactory(db?: Db) {
  const authUserFactory = myAuthUserFactory();
  const appUserFactory = myAppUserFactory(db);
  const userServiceFactory = myUserServiceFactory(
    authUserFactory.authUserUseCase,
    appUserFactory.appUserUseCase
  );
  return {
    authUserFactory,
    appUserFactory,
    userServiceFactory,
  };
}
