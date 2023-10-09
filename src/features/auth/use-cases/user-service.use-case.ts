import { ApplicationError, ErrorCode } from "@common/errors";
import { AppLogger } from "@common/logging/logger";
import { User } from "../entities/user";
import { IAppUserUseCase } from "../ports/app-user.use-case.definition";
import {
  IUserServiceUseCase,
  UserServiceCreateInput,
  UserServiceLookUpInput,
} from "../ports/user-service.use-case.definition";
import { IAuthUserUseCase } from "../ports/auth-user.use-case.definition";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

export class UserServiceUseCase implements IUserServiceUseCase {
  constructor(
    private readonly authUserUseCase: IAuthUserUseCase,
    private readonly appUserUseCase: IAppUserUseCase
  ) {}

  /**
   * Create a new auth user and app user and link them together
   *
   * If the creation of the app user fails, a auth user will exists with no
   * app user linked to it. To solve this issue we use get or create
   * to retrieve the no linked auth user and link it to the app user
   *
   * @param input Auth user data and app user data
   * @returns The created auth user and app user
   */
  async create(input: UserServiceCreateInput): Promise<User> {
    myLogger.debug("creating or getting auth user");
    const authUser = await this.authUserUseCase.getOrCreate({
      data: input.authUserData,
    });
    const userId = authUser.id;
    myLogger.debug("auth user created or got", {
      email: authUser.email,
      userId,
    });

    myLogger.debug("checking if auth user has an app user");
    const existing = await this.appUserUseCase.getOneBy({
      searchBy: { userId: userId },
    });
    if (existing) {
      throw new ApplicationError(
        "the provided email is already in use by an existing auth user",
        ErrorCode.DUPLICATED_RECORD,
        { fieldName: "email" }
      );
    }
    myLogger.debug("auth user has no app user, creating one", { userId });
    const appUser = await this.appUserUseCase.create({
      data: { ...input.appUserData, userId: userId },
    });
    myLogger.debug("app user created", { userId, appUserId: appUser.id });
    return {
      authUser: authUser,
      appUser,
    };
  }

  /**
   * Get an auth user and its app user
   *
   * Both auth user and an app user must exist, otherwise the result is
   * an application integrity error
   *
   * @param input userId
   * @returns The auth user and its app user
   */
  async getOneByUserId(
    input: UserServiceLookUpInput
  ): Promise<User | undefined> {
    const userId = input.searchBy.id;
    myLogger.debug("getting auth user by user id");
    const authUser = await this.authUserUseCase.getOneBy({
      searchBy: { id: userId },
    });
    const appUser = await this.appUserUseCase.getOneBy({
      searchBy: { userId: userId },
    });

    if (!authUser || !appUser) {
      myLogger.debug("auth user and app user not found", { userId });
      return undefined;
    }

    if (authUser || appUser) {
      myLogger.debug("auth user and app user found", {
        userId,
        appUserId: appUser.id,
      });
      return {
        authUser: authUser,
        appUser,
      };
    }

    const errorParams = {
      appUserFound: !!appUser,
      authUserFound: !!authUser,
      userId,
    };

    throw new ApplicationError(
      "auth user or app user not found",
      ErrorCode.APPLICATION_INTEGRITY_ERROR,
      errorParams
    );
  }

  /**
   * Delete a auth user and its app user
   *
   * Both auth user and an app user must exist, otherwise the result is
   * an application integrity error
   *
   * @param input userId
   * @returns void
   */
  async delete(input: UserServiceLookUpInput): Promise<void> {
    const userId = input.searchBy.id;
    myLogger.debug("trying to get auth user with user id");
    const user = await this.getOneByUserId(input);
    if (!user) {
      throw new ApplicationError(
        "auth user and app user with given user id not found",
        ErrorCode.NOT_FOUND
      );
    }
    myLogger.debug("deleting auth user and app user", { userId });
    await this.authUserUseCase.delete({ searchBy: { id: userId } });
    await this.appUserUseCase.delete({ searchBy: { id: user.appUser.id } });
    myLogger.debug("auth user and app user deleted", { userId });
  }
}
