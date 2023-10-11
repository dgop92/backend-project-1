import { Db } from "mongodb";
import { myRestaurantFactory } from "./resturant.factory";
import { myProductFactory } from "./product.factory";
import { myOrderFactory } from "./order.factory";
import { OrderRepository } from "../mongo/repositories/order.repository";

export function businessFactory(db?: Db) {
  const restaurantFactory = myRestaurantFactory(db);
  const productFactory = myProductFactory(db);
  const productRepository = productFactory.productRepository;

  const orderFactory = myOrderFactory(db);
  const orderRepository = orderFactory.orderRepository as OrderRepository;

  orderRepository.setDependencies(productRepository);
  return {
    restaurantFactory,
    productFactory,
    orderFactory,
  };
}
