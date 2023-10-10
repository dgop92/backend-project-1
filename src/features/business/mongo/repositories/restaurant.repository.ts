import { AppLogger } from "@common/logging/logger";
import { SLPaginationResult } from "@common/types/common-types";
import { RestaurantDocument } from "../models/restaurant.document";
import { Collection, ObjectId } from "mongodb";
import { removeUndefinedAndNull } from "@common/helpers";
import {
  IRestaurantRepository,
  RestaurantCreateRepoData,
  RestaurantUpdateRepoData,
} from "@features/business/ports/restaurant.repository.definition";
import { AppUser } from "@features/auth/entities/app-user";
import { Restaurant } from "@features/business/entities/restaurant";
import { RestaurantSearchInput } from "@features/business/schema-types";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

export class RestaurantRepository implements IRestaurantRepository {
  constructor(private readonly collection: Collection<RestaurantDocument>) {}

  async create(
    input: RestaurantCreateRepoData,
    appUser: AppUser
  ): Promise<Restaurant> {
    myLogger.debug("creating restaurant");
    const data = {
      ...input,
      appUserId: appUser.id,
      popularity: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await this.collection.insertOne(data);
    myLogger.debug("restaurant created", {
      id: result.insertedId.toHexString(),
    });
    return {
      id: result.insertedId.toHexString(),
      ...data,
    };
  }

  async update(
    restaurant: Restaurant,
    input: RestaurantUpdateRepoData
  ): Promise<Restaurant> {
    myLogger.debug("updating restaurant", {
      id: restaurant.id,
      ...input,
    });
    const dataToUpdate = removeUndefinedAndNull(input);
    const updateDoc = {
      $set: {
        ...dataToUpdate,
        updatedAt: new Date(),
      },
    };
    await this.collection.updateOne(
      { _id: new ObjectId(restaurant.id) },
      updateDoc
    );
    myLogger.debug("restaurant updated", { id: restaurant.id });
    return {
      ...restaurant,
      ...dataToUpdate,
    };
  }

  async delete(restaurant: Restaurant): Promise<void> {
    myLogger.debug("deleting restaurant", { id: restaurant.id });
    // soft delete
    await this.collection.updateOne(
      { _id: new ObjectId(restaurant.id) },
      {
        $set: {
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
      }
    );
    myLogger.debug("restaurant deleted", { id: restaurant.id });
  }

  async getOneBy(
    input: RestaurantSearchInput
  ): Promise<Restaurant | undefined> {
    myLogger.debug("getting one restaurant by", { input });
    const query = this.getQuery(input.searchBy);

    const result = await this.collection.findOne(query);

    if (result === null) {
      myLogger.debug("restaurant not found");
      return undefined;
    }

    const { _id, ...rest } = result ?? {};
    myLogger.debug("restaurant found", { id: _id.toHexString() });
    return {
      id: _id.toHexString(),
      ...rest,
    };
  }

  async getManyBy(
    input: RestaurantSearchInput
  ): Promise<SLPaginationResult<Restaurant>> {
    myLogger.debug("getting many Restaurants by", { input });
    const query = this.getQuery(input.searchBy);
    const cursor = this.collection.find(query);

    const documents = await cursor.toArray();
    const totalCount = documents.length;
    const restaurants = documents.map((document) => {
      const { _id, ...rest } = document;
      return {
        id: _id.toHexString(),
        ...rest,
      };
    });

    return {
      count: totalCount,
      results: restaurants,
    };
  }

  private getQuery(searchBy: RestaurantSearchInput["searchBy"]) {
    const query: { [key: string]: any } = {};

    if (searchBy?.id) {
      query["_id"] = new ObjectId(searchBy.id);
    }

    if (searchBy?.appUserId) {
      query["appUserId"] = new ObjectId(searchBy.appUserId);
    }

    if (searchBy?.name) {
      query["name"] = { $regex: searchBy.name, $options: "i" };
    }

    if (searchBy?.category) {
      query["category"] = searchBy.category;
    }

    // retrieve only non-deleted restaurants
    query["deletedAt"] = null;

    return query;
  }
}
