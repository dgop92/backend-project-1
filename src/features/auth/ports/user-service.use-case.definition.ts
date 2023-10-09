import { User } from "../entities/user";
import { AppUserCreateInput, AuthUserCreateInput } from "../schema-types";

export type UserServiceCreateInput = {
  authUserData: AuthUserCreateInput["data"];
  appUserData: Omit<AppUserCreateInput["data"], "userId">;
};

export type UserServiceLookUpInput = {
  searchBy: {
    id: string;
  };
};

export interface IUserServiceUseCase {
  create(input: UserServiceCreateInput): Promise<User>;
  getOneByUserId(input: UserServiceLookUpInput): Promise<User | undefined>;
  delete(input: UserServiceLookUpInput): Promise<void>;
}
