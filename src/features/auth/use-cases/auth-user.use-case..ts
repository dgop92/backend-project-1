import { ApplicationError, ErrorCode } from "@common/errors";
import { AppLogger } from "@common/logging/logger";
import { validateDataWithJoi } from "@common/validations";
import Joi from "joi";
import {
  AuthUser,
  AuthUserCreateInputSchema,
  AuthUserSearchInputSchema,
} from "../entities/auth-user";
import { IAuthUserRepository } from "../ports/auth-user.repository.definition";
import {
  IAuthUserUseCase,
  AuthUserLookUpField,
} from "../ports/auth-user.use-case.definition";
import { AuthUserCreateInput, AuthUserSearchInput } from "../schema-types";
import { SearchByUidSchema } from "../utils";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

export class AuthUserUseCase implements IAuthUserUseCase {
  constructor(private readonly userRepository: IAuthUserRepository) {}

  async create(input: AuthUserCreateInput): Promise<AuthUser> {
    myLogger.debug("validating auth user create data");
    this.validateInput(AuthUserCreateInputSchema, input);
    /* 
    const hashedPassword = await bcrypt.hash(input.data.password, 8);
    const email = input.data.email;
    */
    myLogger.debug("create auth user using repository", {
      email: input.data.email,
    });
    return this.userRepository.create(input.data);
  }

  async delete(input: AuthUserLookUpField): Promise<void> {
    myLogger.debug("validating auth user delete data");
    this.validateInput(SearchByUidSchema, input);

    myLogger.debug("trying to get auth user", { id: input.searchBy.id });
    const authUser = await this.userRepository.getOneBy({
      searchBy: { id: input.searchBy.id },
    });

    if (!authUser) {
      myLogger.debug("auth user not found, cannot delete", {
        id: input.searchBy.id,
      });
      throw new ApplicationError(
        "auth user with given id was not found",
        ErrorCode.NOT_FOUND
      );
    }

    myLogger.debug("auth user found, deleting", { id: input.searchBy.id });
    await this.userRepository.delete(authUser);
  }

  getOneBy(input: AuthUserSearchInput): Promise<AuthUser | undefined> {
    myLogger.debug("validating auth user search data");
    this.validateInput(AuthUserSearchInputSchema, input);
    myLogger.debug("get auth user using repository", input);
    return this.userRepository.getOneBy(input);
  }

  async getOrCreate(input: AuthUserCreateInput): Promise<AuthUser> {
    myLogger.debug("validating auth user create data");
    this.validateInput(AuthUserCreateInputSchema, input);

    const email = input.data.email;
    myLogger.debug("trying to get auth user with email", { email });
    const authUser = await this.userRepository.getOneBy({
      searchBy: { email },
    });
    if (authUser) {
      myLogger.debug("auth user found with email", { email });
      return authUser;
    }

    myLogger.debug("user not found with email", { email });
    myLogger.debug("creating new user with email", { email });
    return this.userRepository.create(input.data);
  }

  private validateInput(schema: Joi.ObjectSchema, input: any): void {
    validateDataWithJoi(schema, input);
  }
}
