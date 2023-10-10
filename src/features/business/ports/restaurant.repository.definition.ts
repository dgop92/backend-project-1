import { AppUser } from "@features/auth/entities/app-user";
import { Restaurant } from "../entities/restaurant";
import {
  RestaurantCreateInput,
  RestaurantSearchInput,
  RestaurantUpdateInput,
} from "../schema-types";
import { SLPaginationResult } from "@common/types/common-types";

export type RestaurantCreateRepoData = RestaurantCreateInput["data"];
export type RestaurantUpdateRepoData = RestaurantUpdateInput["data"];

export interface IRestaurantRepository {
  create(
    input: RestaurantCreateRepoData,
    appUser: AppUser
  ): Promise<Restaurant>;
  update(
    restaurant: Restaurant,
    input: RestaurantUpdateRepoData
  ): Promise<Restaurant>;
  delete(restaurant: Restaurant): Promise<void>;
  getOneBy(input: RestaurantSearchInput): Promise<Restaurant | undefined>;
  getManyBy(
    input: RestaurantSearchInput
  ): Promise<SLPaginationResult<Restaurant>>;
}
