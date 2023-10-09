import { AuthUser } from "../entities/auth-user";
import { AuthUserCreateInput, AuthUserSearchInput } from "../schema-types";

export type AuthUserLookUpField = {
  searchBy: {
    id: string;
  };
};

export interface IAuthUserUseCase {
  create(input: AuthUserCreateInput): Promise<AuthUser>;
  getOneBy(input: AuthUserSearchInput): Promise<AuthUser | undefined>;
  delete(input: AuthUserLookUpField): Promise<void>;
  getOrCreate(input: AuthUserCreateInput): Promise<AuthUser>;
}
