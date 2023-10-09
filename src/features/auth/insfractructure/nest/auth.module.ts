import { Module } from "@nestjs/common";
import { AppUserControllerV1 } from "./controllers/v1/app-user.controller";

@Module({
  controllers: [AppUserControllerV1],
})
export class AuthModule {}
