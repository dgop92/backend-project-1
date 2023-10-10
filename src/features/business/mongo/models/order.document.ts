import { Order } from "@features/business/entities/order";
import { Db, ObjectId } from "mongodb";

export type OrderDocument = Omit<Order, "id" | "restaurantId" | "appUserId"> & {
  restaurantId: ObjectId;
  appUserId: ObjectId;
};

export function getOrderCollection(database: Db) {
  return database.collection<OrderDocument>("orders");
}
