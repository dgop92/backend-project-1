import { Module } from "@nestjs/common";
import { RestaurantControllerV1 } from "./controllers/v1/restaurant.controller";

@Module({
  controllers: [RestaurantControllerV1],
})
export class BusinessModule {}
