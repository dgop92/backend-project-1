import { Module } from "@nestjs/common";
import { RestaurantControllerV1 } from "./controllers/v1/restaurant.controller";
import { ProductControllerV1 } from "./controllers/v1/product.controller";

@Module({
  controllers: [RestaurantControllerV1, ProductControllerV1],
})
export class BusinessModule {}
