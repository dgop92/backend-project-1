import { AppLogger } from "@common/logging/logger";
import { Db } from "mongodb";
import { getRestaurantCollection } from "../mongo/models/restaurant.document";
import { RestaurantRepository } from "../mongo/repositories/restaurant.repository";
import { IRestaurantRepository } from "../ports/restaurant.repository.definition";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

let restaurantRepository: IRestaurantRepository;

export const myRestaurantFactory = (database?: Db) => {
  myLogger.info("calling restaurantFactory");

  if (database !== undefined && restaurantRepository === undefined) {
    myLogger.info("creating restaurantRepository");
    const collection = getRestaurantCollection(database);
    restaurantRepository = new RestaurantRepository(collection);
    myLogger.info("restaurantRepository created");
  }

  return {
    restaurantRepository,
  };
};
