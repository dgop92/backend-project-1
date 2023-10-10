import { AppLogger } from "@common/logging/logger";
import { Db } from "mongodb";
import { getProductCollection } from "../mongo/models/product.document";
import { ProductRepository } from "../mongo/repositories/product.repository";
import { IProductRepository } from "../ports/product.repository.definition";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

let productRepository: IProductRepository;

export const myProductFactory = (database?: Db) => {
  myLogger.info("calling productFactory");

  if (database !== undefined && productRepository === undefined) {
    myLogger.info("creating productRepository");
    const collection = getProductCollection(database);
    productRepository = new ProductRepository(collection);
    myLogger.info("productRepository created");
  }

  return {
    productRepository,
  };
};
