import { AppLogger } from "@common/logging/logger";
import { IAppUserUseCase } from "../ports/app-user.use-case.definition";
import { IAuthUserUseCase } from "../ports/auth-user.use-case.definition";
import { IUserServiceUseCase } from "../ports/user-service.use-case.definition";
import { UserServiceUseCase } from "../use-cases/user-service.use-case";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

let userServiceUseCase: IUserServiceUseCase;

export const myUserServiceFactory = (
  authUserUseCase?: IAuthUserUseCase,
  appUserUseCase?: IAppUserUseCase
) => {
  myLogger.info("calling userServiceFactory factory");

  if (userServiceUseCase === undefined) {
    if (authUserUseCase !== undefined && appUserUseCase !== undefined) {
      myLogger.info("creating userServiceUseCase");
      userServiceUseCase = new UserServiceUseCase(
        authUserUseCase,
        appUserUseCase
      );
      myLogger.info("userServiceUseCase created");
    }
  }

  return {
    userServiceUseCase,
  };
};
