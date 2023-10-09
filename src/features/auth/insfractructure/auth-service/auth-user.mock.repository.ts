import { AppLogger } from "@common/logging/logger";
import { ErrorCode, RepositoryError } from "@common/errors";
import {
  IAuthUserRepository,
  AuthUserCreateRepoData,
} from "@features/auth/ports/auth-user.repository.definition";
import { AuthUser } from "@features/auth/entities/auth-user";
import { AuthUserSearchInput } from "@features/auth/schema-types";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

function generateUserId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export class AuthUserMockedRepository implements IAuthUserRepository {
  static authUsers: AuthUser[] = [];

  create(input: AuthUserCreateRepoData): Promise<AuthUser> {
    myLogger.debug("creating auth user", { email: input.email });
    const isEmailAlreadyInUse = AuthUserMockedRepository.authUsers.some(
      (authUser) => authUser.email === input.email
    );
    if (isEmailAlreadyInUse) {
      myLogger.debug("email already exists", { email: input.email });
      throw new RepositoryError(
        "the provided email is already in use by an existing auth user",
        ErrorCode.DUPLICATED_RECORD,
        { fieldName: "email" }
      );
    }
    const authUser = {
      id: generateUserId(),
      email: input.email,
    };
    AuthUserMockedRepository.authUsers.push(authUser);
    myLogger.debug("auth user created", { email: input.email });
    return Promise.resolve(authUser);
  }

  delete(authUser: AuthUser): Promise<void> {
    myLogger.debug("deleting auth user", { id: authUser.id });
    AuthUserMockedRepository.authUsers =
      AuthUserMockedRepository.authUsers.filter(
        (authUser) => authUser.id !== authUser.id
      );
    myLogger.debug("auth user deleted", { id: authUser.id });
    return Promise.resolve();
  }

  getOneBy(input: AuthUserSearchInput): Promise<AuthUser | undefined> {
    const email = input.searchBy?.email;
    const id = input.searchBy?.id;

    if (email) {
      return this.getByEmail(email);
    }

    if (id) {
      return this.getById(id);
    }

    myLogger.debug("cannot get auth user because no search criteria provided");
    return Promise.resolve(undefined);
  }

  async getByEmail(email: string): Promise<AuthUser | undefined> {
    myLogger.debug("getting auth user by email", { email });
    const authUser = AuthUserMockedRepository.authUsers.find(
      (authUser) => authUser.email === email
    );
    myLogger.debug("auth user found", { email });
    return Promise.resolve(authUser);
  }

  async getById(id: string): Promise<AuthUser | undefined> {
    myLogger.debug("getting auth user by id", { id });
    const authUser = AuthUserMockedRepository.authUsers.find(
      (authUser) => authUser.id === id
    );
    myLogger.debug("auth user found", { id });
    return Promise.resolve(authUser);
  }

  deleteAll(): Promise<void> {
    myLogger.debug("deleting all auth users");
    AuthUserMockedRepository.authUsers = [];
    myLogger.debug("all auth users deleted");
    return Promise.resolve();
  }

  verifyToken(token: string): Promise<AuthUser> {
    try {
      return JSON.parse(token);
    } catch (error) {
      return Promise.resolve({
        email: "some@email.com",
        id: "xx222deok33WOf22LCufOHXSOcxx",
      });
    }
  }
}
