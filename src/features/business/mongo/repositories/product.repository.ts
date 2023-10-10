import { AppLogger } from "@common/logging/logger";
import { SLPaginationResult } from "@common/types/common-types";
import { Collection, ObjectId } from "mongodb";
import { removeUndefinedAndNull } from "@common/helpers";
import {
  IProductRepository,
  ProductCreateRepoData,
  ProductUpdateRepoData,
} from "@features/business/ports/product.repository.definition";
import { ProductDocument } from "../models/product.document";
import { Product } from "@features/business/entities/product";
import { ProductSearchInput } from "@features/business/schema-types";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

export class ProductRepository implements IProductRepository {
  constructor(private readonly collection: Collection<ProductDocument>) {}

  async create(input: ProductCreateRepoData): Promise<Product> {
    myLogger.debug("creating product");
    const data = {
      ...input,
      restaurantId: new ObjectId(input.restaurantId),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await this.collection.insertOne(data);
    myLogger.debug("product created", {
      id: result.insertedId.toHexString(),
    });
    return {
      ...data,
      id: result.insertedId.toHexString(),
      restaurantId: data.restaurantId.toHexString(),
    };
  }

  async update(
    product: Product,
    input: ProductUpdateRepoData
  ): Promise<Product> {
    myLogger.debug("updating product", {
      id: product.id,
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
      { _id: new ObjectId(product.id) },
      updateDoc
    );
    myLogger.debug("product updated", { id: product.id });
    return {
      ...product,
      ...dataToUpdate,
    };
  }

  async delete(product: Product): Promise<void> {
    myLogger.debug("deleting product", { id: product.id });
    // soft delete
    await this.collection.updateOne(
      { _id: new ObjectId(product.id) },
      {
        $set: {
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
      }
    );
    myLogger.debug("product deleted", { id: product.id });
  }

  async getOneBy(input: ProductSearchInput): Promise<Product | undefined> {
    myLogger.debug("getting one product by", { input });
    const query = this.getQuery(input.searchBy);

    const result = await this.collection.findOne(query);

    if (result === null) {
      myLogger.debug("product not found");
      return undefined;
    }

    const { _id, ...rest } = result ?? {};
    myLogger.debug("product found", { id: _id.toHexString() });
    return {
      ...rest,
      id: _id.toHexString(),
      restaurantId: rest.restaurantId.toHexString(),
    };
  }

  async getManyBy(
    input: ProductSearchInput
  ): Promise<SLPaginationResult<Product>> {
    myLogger.debug("getting many Products by", { input });
    const query = this.getQuery(input.searchBy);
    const cursor = this.collection.find(query);

    const documents = await cursor.toArray();
    const totalCount = documents.length;
    const products = documents.map((document) => {
      const { _id, ...rest } = document;
      return {
        ...rest,
        id: _id.toHexString(),
        restaurantId: rest.restaurantId.toHexString(),
      };
    });

    return {
      count: totalCount,
      results: products,
    };
  }

  private getQuery(searchBy: ProductSearchInput["searchBy"]) {
    const query: { [key: string]: any } = {};

    if (searchBy?.id) {
      query["_id"] = new ObjectId(searchBy.id);
    }

    if (searchBy?.category) {
      query["category"] = searchBy.category;
    }

    if (searchBy?.restaurantId) {
      query["restaurantId"] = new ObjectId(searchBy.restaurantId);
    }

    if (searchBy?.ids) {
      query["_id"] = { $in: searchBy.ids.map((id) => new ObjectId(id)) };
    }

    // retrieve only non-deleted products
    query["deletedAt"] = null;

    return query;
  }
}
