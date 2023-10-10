import { Db } from "mongodb";
import { myRestaurantFactory } from "./resturant.factory";

export function businessFactory(db?: Db) {
  const restaurantFactory = myRestaurantFactory(db);
  return {
    restaurantFactory,
  };
}
