import { Restaurant } from "@features/business/entities/restaurant";
import { Db, ObjectId } from "mongodb";

export type RestaurantDocument = Omit<Restaurant, "id" | "appUserId"> & {
  appUserId: ObjectId;
};

export function getRestaurantCollection(database: Db) {
  return database.collection<RestaurantDocument>("restaurants");
}
