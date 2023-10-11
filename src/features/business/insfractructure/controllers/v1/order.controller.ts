import { ErrorCode, PresentationError } from "@common/errors";
import { StringLookUpInputSchema } from "@common/schemas/idValidations";
import { validateDataWithJoi } from "@common/validations";
import { User } from "@features/auth/entities/user";
import { GetUser } from "@features/auth/insfractructure/nest/custom-decorators";
import { DummyUserGuard } from "@features/auth/insfractructure/nest/guards/users.guard";
import {
  OrderCreateInputSchema,
  OrderSearchInputSchema,
  OrderUpdateInputSchema,
  OrderUpdateStatusInputSchema,
} from "@features/business/entities/order";
import { myOrderFactory } from "@features/business/factories/order.factory";
import { myRestaurantFactory } from "@features/business/factories/resturant.factory";
import { IOrderRepository } from "@features/business/ports/order.repository.definition";
import { IRestaurantRepository } from "@features/business/ports/restaurant.repository.definition";
import {
  OrderCreateInput,
  OrderSearchInput,
  OrderUpdateInput,
  OrderUpdateStatusInput,
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

type UpdateOrderRequest = OrderUpdateInput["data"];
type CreateOrderRequest = OrderCreateInput["data"];
type UpdateOrderStatusRequest = OrderUpdateStatusInput["data"];

type QueryParams = Required<OrderSearchInput>["searchBy"] &
  Omit<Required<OrderSearchInput>["filterBy"], "createdAt"> & {
    createdAtFrom?: string;
    createdAtTo?: string;
  };

@Controller({
  path: "orders",
  version: "1",
})
export class OrderControllerV1 {
  private readonly orderRepository: IOrderRepository;
  private readonly restaurantRepository: IRestaurantRepository;
  constructor() {
    const { orderRepository } = myOrderFactory();
    const { restaurantRepository } = myRestaurantFactory();
    this.orderRepository = orderRepository;
    this.restaurantRepository = restaurantRepository;
  }

  @Get()
  list(@Query() query: QueryParams) {
    const searchQuery = {
      searchBy: {
        appUserId: query.appUserId,
        restaurantId: query.restaurantId,
        id: query.id,
      },
      filterBy: {
        status: query.status,
        createdAt: {
          from: query.createdAtFrom,
          to: query.createdAtTo,
        },
      },
    };
    const value = validateDataWithJoi<OrderSearchInput>(
      OrderSearchInputSchema,
      searchQuery
    );

    return this.orderRepository.getManyBy(value);
  }

  @UseGuards(DummyUserGuard)
  @Post()
  async create(@GetUser() user: User, @Body() data: CreateOrderRequest) {
    validateDataWithJoi(OrderCreateInputSchema, { data });
    const appUser = user.appUser;

    const order = await this.orderRepository.create({
      ...data,
      appUserId: appUser.id,
    });

    return order;
  }

  @UseGuards(DummyUserGuard)
  @Patch("/:id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() data: UpdateOrderStatusRequest
  ) {
    validateDataWithJoi(OrderUpdateStatusInputSchema, {
      data,
      searchBy: { id },
    });
    const order = await this.orderRepository.getOneBy({
      searchBy: { id },
    });

    if (!order) {
      throw new PresentationError("order not found", ErrorCode.NOT_FOUND);
    }

    const newOrder = await this.orderRepository.updateStatus(order, data);

    const restaurant = await this.restaurantRepository.getOneBy({
      searchBy: { id: order.restaurantId },
    });

    if (!restaurant) {
      throw new PresentationError("restaurant not found", ErrorCode.NOT_FOUND);
    }

    if (newOrder.status === "delivered") {
      await this.restaurantRepository.updatePopularityByOne(restaurant);
    }

    return newOrder;
  }

  @Get("/:id")
  async getOne(@Param("id") id: string) {
    validateDataWithJoi(StringLookUpInputSchema, { id });
    const order = await this.orderRepository.getOneBy({
      searchBy: { id },
    });
    if (!order) {
      throw new PresentationError("order not found", ErrorCode.NOT_FOUND);
    }
    return order;
  }

  @UseGuards(DummyUserGuard)
  @Patch("/:id")
  async updateOne(
    @Param("id") id: string,
    @Body() data: UpdateOrderRequest,
    @GetUser() user: User
  ) {
    validateDataWithJoi(OrderUpdateInputSchema, {
      data,
      searchBy: { id },
    });
    const order = await this.orderRepository.getOneBy({
      searchBy: { id },
    });

    if (!order) {
      throw new PresentationError("order not found", ErrorCode.NOT_FOUND);
    }

    if (order.status === "on-the-way" || order.status === "delivered") {
      throw new PresentationError(
        "you are not allowed to update an order that is on the way or delivered",
        ErrorCode.INVALID_OPERATION
      );
    }

    if (order.appUserId !== user.appUser.id) {
      throw new PresentationError(
        "you are not allowed to update this order",
        ErrorCode.FORBIDDEN
      );
    }

    const newOrder = await this.orderRepository.update(order, data);

    return newOrder;
  }

  @UseGuards(DummyUserGuard)
  @Delete("/:id")
  async deleteOne(@Param("id") id: string, @GetUser() user: User) {
    validateDataWithJoi(StringLookUpInputSchema, { id });

    const order = await this.orderRepository.getOneBy({
      searchBy: { id },
    });

    if (!order) {
      throw new PresentationError("order not found", ErrorCode.NOT_FOUND);
    }

    if (order.appUserId !== user.appUser.id) {
      throw new PresentationError(
        "you are not allowed to update this order",
        ErrorCode.FORBIDDEN
      );
    }

    await this.orderRepository.delete(order);
  }
}
