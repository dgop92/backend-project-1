import { AppUser } from "../entities/app-user";
import {
  AppUserCreateInput,
  AppUserSearchInput,
  AppUserUpdateInput,
} from "../schema-types";

export type AppUserLookUpField = {
  searchBy: {
    id: string;
  };
};

export interface IAppUserUseCase {
  create(input: AppUserCreateInput): Promise<AppUser>;
  create(input: AppUserCreateInput, transactionManager?: any): Promise<AppUser>;
  update(input: AppUserUpdateInput): Promise<AppUser>;
  update(input: AppUserUpdateInput, transactionManager?: any): Promise<AppUser>;
  delete(input: AppUserLookUpField): Promise<void>;
  delete(input: AppUserLookUpField, transactionManager?: any): Promise<void>;
  getOneBy(input: AppUserSearchInput): Promise<AppUser | undefined>;
  getOneBy(
    input: AppUserSearchInput,
    transactionManager?: any
  ): Promise<AppUser | undefined>;
}
