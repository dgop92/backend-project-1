import { AppLogger } from "@common/logging/logger";
import { IAuthUserRepository } from "../ports/auth-user.repository.definition";
import { IAuthUserUseCase } from "../ports/auth-user.use-case.definition";
import { AuthUserUseCase } from "../use-cases/auth-user.use-case.";
import { AuthUserMockedRepository } from "../insfractructure/auth-service/auth-user.mock.repository";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

let authUserRepository: IAuthUserRepository;
let authUserUseCase: IAuthUserUseCase;

export const myAuthUserFactory = () => {
  myLogger.info("calling authUserFactory");

  if (authUserRepository === undefined) {
    authUserRepository = new AuthUserMockedRepository();
    myLogger.info("authUserRepository created");
  }

  if (authUserUseCase === undefined) {
    myLogger.info("creating authUserUseCase");
    authUserUseCase = new AuthUserUseCase(authUserRepository);
    myLogger.info("authUserUseCase created");
  }

  return {
    authUserRepository,
    authUserUseCase,
  };
};
