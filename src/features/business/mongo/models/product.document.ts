import { Product } from "@features/business/entities/product";
import { Db, ObjectId } from "mongodb";

export type ProductDocument = Omit<Product, "id" | "restaurantId"> & {
  restaurantId: ObjectId;
};

export function getProductCollection(database: Db) {
  return database.collection<ProductDocument>("products");
}
