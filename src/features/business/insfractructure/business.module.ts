import { Module } from "@nestjs/common";
import { RestaurantControllerV1 } from "./controllers/v1/restaurant.controller";
import { ProductControllerV1 } from "./controllers/v1/product.controller";
import { OrderControllerV1 } from "./controllers/v1/order.controller";

@Module({
  controllers: [RestaurantControllerV1, ProductControllerV1, OrderControllerV1],
})
export class BusinessModule {}
