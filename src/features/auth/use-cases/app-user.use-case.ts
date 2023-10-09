import { ApplicationError, ErrorCode } from "@common/errors";
import { AppLogger } from "@common/logging/logger";
import { validateDataWithJoi } from "@common/validations";
import Joi from "joi";
import {
  AppUser,
  AppUserCreateInputSchema,
  AppUserSearchInputSchema,
  AppUserUpdateInputSchema,
} from "../entities/app-user";
import { IAppUserRepository } from "../ports/app-user.repository.definition";
import {
  AppUserLookUpField,
  IAppUserUseCase,
} from "../ports/app-user.use-case.definition";
import {
  AppUserCreateInput,
  AppUserUpdateInput,
  AppUserSearchInput,
} from "../schema-types";
import { SearchByIdSchema } from "../utils";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

export class AppUserUseCase implements IAppUserUseCase {
  constructor(private readonly userRepository: IAppUserRepository) {}

  create(input: AppUserCreateInput): Promise<AppUser>;
  create(input: AppUserCreateInput, transactionManager?: any): Promise<AppUser>;
  async create(
    input: AppUserCreateInput,
    transactionManager?: any
  ): Promise<AppUser> {
    myLogger.debug("validating app user create data");
    this.validateInput(AppUserCreateInputSchema, input);
    return this.userRepository.create(input.data, transactionManager);
  }

  update(input: AppUserUpdateInput): Promise<AppUser>;
  update(input: AppUserUpdateInput, transactionManager?: any): Promise<AppUser>;
  async update(
    input: AppUserUpdateInput,
    transactionManager?: any
  ): Promise<AppUser> {
    myLogger.debug("validating app user update data");
    this.validateInput(AppUserUpdateInputSchema, input);

    const {
      data,
      searchBy: { id },
    } = input;

    myLogger.debug("trying to get app user", { id });
    const appUser = await this.userRepository.getOneBy(
      { searchBy: { id } },
      transactionManager
    );

    if (!appUser) {
      myLogger.debug("app user not found, cannot update", {
        id: input.searchBy.id,
      });
      throw new ApplicationError(
        "app user with given id was not found",
        ErrorCode.NOT_FOUND
      );
    }

    myLogger.debug("updating user", { id });
    return this.userRepository.update(appUser, data, transactionManager);
  }

  delete(input: AppUserLookUpField): Promise<void>;
  delete(input: AppUserLookUpField, transactionManager?: any): Promise<void>;
  async delete(
    input: AppUserLookUpField,
    transactionManager?: any
  ): Promise<void> {
    myLogger.debug("validating app user delete data");
    this.validateInput(SearchByIdSchema, input);

    const id = input.searchBy.id;

    myLogger.debug("trying to get app user", { id });
    const appUser = await this.userRepository.getOneBy(
      { searchBy: { id } },
      transactionManager
    );

    if (!appUser) {
      myLogger.debug("app user not found, cannot update", {
        id,
      });
      throw new ApplicationError(
        "app user with given id was not found",
        ErrorCode.NOT_FOUND
      );
    }

    myLogger.debug("user found, deleting", { id: input.searchBy.id });
    this.userRepository.delete(appUser, transactionManager);
  }

  getOneBy(input: AppUserSearchInput): Promise<AppUser | undefined>;
  getOneBy(
    input: AppUserSearchInput,
    transactionManager?: any
  ): Promise<AppUser | undefined>;
  getOneBy(
    input: AppUserSearchInput,
    transactionManager?: any
  ): Promise<AppUser | undefined> {
    myLogger.debug("validating app user get one by data");
    this.validateInput(AppUserSearchInputSchema, input);
    return this.userRepository.getOneBy(input, transactionManager);
  }

  private validateInput(schema: Joi.ObjectSchema, input: any): void {
    validateDataWithJoi(schema, input);
  }
}
