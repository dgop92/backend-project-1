import { ApplicationError, ErrorCode, PresentationError } from "@common/errors";
import { StringLookUpInputSchema } from "@common/schemas/idValidations";
import { validateDataWithJoi } from "@common/validations";
import { User } from "@features/auth/entities/user";
import { GetUser } from "@features/auth/insfractructure/nest/custom-decorators";
import { DummyUserGuard } from "@features/auth/insfractructure/nest/guards/users.guard";
import {
  RestaurantCreateInputSchema,
  RestaurantSearchInputSchema,
  RestaurantUpdateInputSchema,
} from "@features/business/entities/restaurant";
import { myRestaurantFactory } from "@features/business/factories/resturant.factory";
import { IRestaurantRepository } from "@features/business/ports/restaurant.repository.definition";
import {
  RestaurantCreateInput,
  RestaurantSearchInput,
  RestaurantUpdateInput,
} from "@features/business/schema-types";
import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";

type UpdateUserRequest = RestaurantUpdateInput["data"];
type CreateUserRequest = RestaurantCreateInput["data"];

type QueryParams = Omit<
  Required<RestaurantSearchInput>["searchBy"],
  "id" | "appUserId"
>;

@Controller({
  path: "restaurants",
  version: "1",
})
export class RestaurantControllerV1 {
  private readonly restaurantRepository: IRestaurantRepository;
  constructor() {
    const { restaurantRepository } = myRestaurantFactory();
    this.restaurantRepository = restaurantRepository;
  }

  @UseGuards(DummyUserGuard)
  @Post()
  create(@GetUser() user: User, @Body() data: CreateUserRequest) {
    validateDataWithJoi(RestaurantCreateInputSchema, { data });
    const appUser = user.appUser;

    if (appUser.type === "CLIENT") {
      throw new ApplicationError(
        "client users can't create a restaurant",
        ErrorCode.FORBIDDEN
      );
    }

    return this.restaurantRepository.create(data, user.appUser);
  }

  @Get()
  list(@Query() query: QueryParams) {
    validateDataWithJoi(RestaurantSearchInputSchema, { searchBy: query });

    return this.restaurantRepository.getManyBy({
      searchBy: query,
    });
  }

  @Get("/:id")
  async getOne(@Param("id") id: string) {
    validateDataWithJoi(StringLookUpInputSchema, { id });
    const restaurant = await this.restaurantRepository.getOneBy({
      searchBy: { id },
    });
    if (!restaurant) {
      throw new PresentationError("restaurant not found", ErrorCode.NOT_FOUND);
    }
    return restaurant;
  }

  @UseGuards(DummyUserGuard)
  @Patch("/:id")
  async updateOne(
    @Param("id") id: string,
    @Body() data: UpdateUserRequest,
    @GetUser() user: User
  ) {
    validateDataWithJoi(RestaurantUpdateInputSchema, {
      data,
      searchBy: { id },
    });
    const restaurant = await this.restaurantRepository.getOneBy({
      searchBy: { id },
    });

    if (!restaurant) {
      throw new ApplicationError("restaurant not found", ErrorCode.NOT_FOUND);
    }

    if (restaurant.appUserId !== user.appUser.id) {
      throw new ApplicationError(
        "you are not allowed to update this restaurant",
        ErrorCode.FORBIDDEN
      );
    }

    const newRestaurant = await this.restaurantRepository.update(
      restaurant,
      data
    );

    return newRestaurant;
  }

  @UseGuards(DummyUserGuard)
  @Delete("/:id")
  async deleteOne(@Param("id") id: string, @GetUser() user: User) {
    validateDataWithJoi(StringLookUpInputSchema, { id });
    const restaurant = await this.restaurantRepository.getOneBy({
      searchBy: { id },
    });

    if (!restaurant) {
      throw new ApplicationError("restaurant not found", ErrorCode.NOT_FOUND);
    }

    if (restaurant.appUserId !== user.appUser.id) {
      throw new ApplicationError(
        "you are not allowed to delete this restaurant",
        ErrorCode.FORBIDDEN
      );
    }

    await this.restaurantRepository.delete(restaurant);
  }
}
