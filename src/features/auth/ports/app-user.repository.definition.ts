import { AppUser } from "../entities/app-user";
import {
  AppUserCreateInput,
  AppUserSearchInput,
  AppUserUpdateInput,
} from "../schema-types";

export type AppUserCreateRepoData = AppUserCreateInput["data"];
export type AppUserUpdateRepoData = AppUserUpdateInput["data"];

export interface IAppUserRepository {
  create(input: AppUserCreateRepoData): Promise<AppUser>;
  update(appUser: AppUser, input: AppUserUpdateRepoData): Promise<AppUser>;
  getOneBy(input: AppUserSearchInput): Promise<AppUser | undefined>;
  delete(appUser: AppUser): Promise<void>;
}
