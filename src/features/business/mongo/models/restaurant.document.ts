import { Restaurant } from "@features/business/entities/restaurant";
import { Db } from "mongodb";

export type RestaurantDocument = Omit<Restaurant, "id">;

export function getRestaurantCollection(database: Db) {
  return database.collection<RestaurantDocument>("restaurants");
}
