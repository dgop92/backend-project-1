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
  update(input: AppUserUpdateInput): Promise<AppUser>;
  delete(input: AppUserLookUpField): Promise<void>;
  getOneBy(input: AppUserSearchInput): Promise<AppUser | undefined>;
}
