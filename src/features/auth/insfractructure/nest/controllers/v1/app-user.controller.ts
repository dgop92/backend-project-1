import { ErrorCode, PresentationError } from "@common/errors";
import { myAppUserFactory } from "@features/auth/factories/app-user.factory";
import { IAppUserUseCase } from "@features/auth/ports/app-user.use-case.definition";
import {
  AppUserUpdateInput,
  AppUserCreateInput,
} from "@features/auth/schema-types";
import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
} from "@nestjs/common";

type UpdateUserRequest = AppUserUpdateInput["data"];
type CreateUserRequest = Omit<AppUserCreateInput["data"], "userId">;

@Controller({
  path: "users",
  version: "1",
})
export class AppUserControllerV1 {
  private readonly appUserUseCase: IAppUserUseCase;
  constructor() {
    const { appUserUseCase } = myAppUserFactory();
    this.appUserUseCase = appUserUseCase;
  }

  @Post()
  create(@Body() data: CreateUserRequest) {
    return this.appUserUseCase.create({
      data: {
        ...data,
        userId: "not-implemented",
      },
    });
  }

  @Get("/:id")
  async getOne(@Param("id") id: string) {
    const appUser = await this.appUserUseCase.getOneBy({
      searchBy: { id },
    });
    if (!appUser) {
      throw new PresentationError("user not found", ErrorCode.NOT_FOUND);
    }
    return appUser;
  }

  @Patch("/:id")
  updateOne(@Param("id") id: string, @Body() data: UpdateUserRequest) {
    return this.appUserUseCase.update({
      searchBy: { id },
      data: data,
    });
  }

  @Delete("/:id")
  deleteOne(@Param("id") id: string) {
    return this.appUserUseCase.delete({
      searchBy: { id },
    });
  }
}
