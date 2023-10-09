import { AppLogger } from "@common/logging/logger";
import { IAppUserRepository } from "../ports/app-user.repository.definition";
import { IAppUserUseCase } from "../ports/app-user.use-case.definition";
import { AppUserUseCase } from "../use-cases/app-user.use-case";
import { Db } from "mongodb";
import { AppUserRepository } from "../insfractructure/mongo/repositories/app-user.repository";
import { getAppUserCollection } from "../insfractructure/mongo/models/app-user.document";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

let appUserRepository: IAppUserRepository;
let appUserUseCase: IAppUserUseCase;

export const myAppUserFactory = (database?: Db) => {
  myLogger.info("calling appUserFactory");

  if (database !== undefined && appUserRepository === undefined) {
    myLogger.info("creating appUserRepository");
    const collection = getAppUserCollection(database);
    appUserRepository = new AppUserRepository(collection);
    myLogger.info("appUserRepository created");
  }

  if (appUserUseCase === undefined) {
    myLogger.info("creating appUserUseCase");
    appUserUseCase = new AppUserUseCase(appUserRepository);
    myLogger.info("appUserUseCase created");
  }

  return {
    appUserRepository,
    appUserUseCase,
  };
};
