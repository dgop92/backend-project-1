import { Db } from "mongodb";
import { myRestaurantFactory } from "./resturant.factory";
import { myProductFactory } from "./product.factory";

export function businessFactory(db?: Db) {
  const restaurantFactory = myRestaurantFactory(db);
  const productFactory = myProductFactory(db);
  return {
    restaurantFactory,
    productFactory,
  };
}
