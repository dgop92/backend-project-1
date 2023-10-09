import { AuthUser } from "../entities/auth-user";
import { AuthUserCreateInput, AuthUserSearchInput } from "../schema-types";

export type AuthUserCreateRepoData = AuthUserCreateInput["data"];

export interface IAuthUserRepository {
  create(input: AuthUserCreateRepoData): Promise<AuthUser>;
  delete(user: AuthUser): Promise<void>;
  getOneBy(input: AuthUserSearchInput): Promise<AuthUser | undefined>;
  verifyToken(token: string): Promise<AuthUser>;
  deleteAll(): Promise<void>;
}
