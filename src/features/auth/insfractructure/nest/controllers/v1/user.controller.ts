import { AuthUser } from "@features/auth/entities/auth-user";
import { User } from "@features/auth/entities/user";
import { myAppUserFactory } from "@features/auth/factories/app-user.factory";
import { myUserServiceFactory } from "@features/auth/factories/user-service-factory";
import { IAppUserUseCase } from "@features/auth/ports/app-user.use-case.definition";
import {
  IUserServiceUseCase,
  UserServiceCreateInput,
} from "@features/auth/ports/user-service.use-case.definition";
import { AppUserUpdateInput } from "@features/auth/schema-types";
import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { GetAuthUser, GetUser } from "../../custom-decorators";
import { AuthUserGuard, UserGuard } from "../../guards/users.guard";

type CreateUserRequest = UserServiceCreateInput["appUserData"] &
  UserServiceCreateInput["authUserData"];
type UpdateUserRequest = AppUserUpdateInput["data"];

@Controller({
  path: "users",
  version: "1",
})
export class UserControllerV1 {
  private readonly userServiceUseCase: IUserServiceUseCase;
  private readonly appUserUseCase: IAppUserUseCase;
  constructor() {
    const { userServiceUseCase } = myUserServiceFactory();
    const { appUserUseCase } = myAppUserFactory();
    this.userServiceUseCase = userServiceUseCase;
    this.appUserUseCase = appUserUseCase;
  }

  @Post()
  create(@Body() data: CreateUserRequest) {
    return this.userServiceUseCase.create({
      appUserData: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phone: data.phone,
        type: data.type,
      },
      authUserData: {
        email: data.email,
        password: data.password,
      },
    });
  }

  @UseGuards(UserGuard)
  @Get("/me")
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(UserGuard)
  @Patch("/me")
  updateMe(@GetUser() user: User, @Body() data: UpdateUserRequest) {
    return this.appUserUseCase.update({
      searchBy: { id: user.appUser.id },
      data: data,
    });
  }

  @UseGuards(AuthUserGuard)
  @Delete("/me")
  async deleteMe(@GetAuthUser() user: AuthUser) {
    await this.userServiceUseCase.delete({
      searchBy: { id: user.id },
    });
    return { sucess: true };
  }
}
