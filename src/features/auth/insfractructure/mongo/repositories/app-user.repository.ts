import { AppLogger } from "@common/logging/logger";
import { SLPaginationResult } from "@common/types/common-types";
import { AppUserDocument } from "../models/app-user.document";
import { Collection, ObjectId } from "mongodb";
import {
  AppUserCreateRepoData,
  AppUserUpdateRepoData,
  IAppUserRepository,
} from "@features/auth/ports/app-user.repository.definition";
import { AppUser } from "@features/auth/entities/app-user";
import { removeUndefinedAndNull } from "@common/helpers";
import { AppUserSearchInput } from "@features/auth/schema-types";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

export class AppUserRepository implements IAppUserRepository {
  constructor(private readonly collection: Collection<AppUserDocument>) {}

  async create(input: AppUserCreateRepoData): Promise<AppUser> {
    myLogger.debug("creating app-user");
    const data = {
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await this.collection.insertOne(data);
    myLogger.debug("app-user created", { id: result.insertedId.toHexString() });
    return {
      id: result.insertedId.toHexString(),
      ...data,
    };
  }

  async update(
    appUser: AppUser,
    input: AppUserUpdateRepoData
  ): Promise<AppUser> {
    myLogger.debug("updating app-user", {
      id: appUser.id,
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
      { _id: new ObjectId(appUser.id) },
      updateDoc
    );
    myLogger.debug("app-user updated", { id: appUser.id });
    return {
      ...appUser,
      ...dataToUpdate,
    };
  }

  async delete(appUser: AppUser): Promise<void> {
    myLogger.debug("deleting app-user", { id: appUser.id });
    await this.collection.deleteOne({ _id: new ObjectId(appUser.id) });
    myLogger.debug("app-user deleted", { id: appUser.id });
  }

  async getOneBy(input: AppUserSearchInput): Promise<AppUser | undefined> {
    myLogger.debug("getting one app-user by", { input });
    const query = this.getQuery(input.searchBy);

    const result = await this.collection.findOne(query);

    if (result === null) {
      myLogger.debug("app-user not found");
      return undefined;
    }

    const { _id, ...rest } = result ?? {};
    myLogger.debug("app-user found", { id: _id.toHexString() });
    return {
      id: _id.toHexString(),
      ...rest,
    };
  }

  async getManyBy(
    input: AppUserSearchInput
  ): Promise<SLPaginationResult<AppUser>> {
    myLogger.debug("getting many AppUsers by", { input });
    const query = this.getQuery(input.searchBy);
    const cursor = this.collection.find(query);

    const documents = await cursor.toArray();
    const totalCount = documents.length;
    const appUsers = documents.map((document) => {
      const { _id, ...rest } = document;
      return {
        id: _id.toHexString(),
        ...rest,
      };
    });

    return {
      count: totalCount,
      results: appUsers,
    };
  }

  private getQuery(searchBy: AppUserSearchInput["searchBy"]) {
    const query: { [key: string]: any } = {};

    if (searchBy?.id) {
      query["_id"] = new ObjectId(searchBy.id);
    }

    return query;
  }
}
