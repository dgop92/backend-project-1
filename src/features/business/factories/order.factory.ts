import { AppLogger } from "@common/logging/logger";
import { Db } from "mongodb";
import { getOrderCollection } from "../mongo/models/order.document";
import { OrderRepository } from "../mongo/repositories/order.repository";
import { IOrderRepository } from "../ports/order.repository.definition";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

let orderRepository: IOrderRepository;

export const myOrderFactory = (database?: Db) => {
  myLogger.info("calling orderFactory");

  if (database !== undefined && orderRepository === undefined) {
    myLogger.info("creating orderRepository");
    const collection = getOrderCollection(database);
    orderRepository = new OrderRepository(collection);
    myLogger.info("orderRepository created");
  }

  return {
    orderRepository,
  };
};
