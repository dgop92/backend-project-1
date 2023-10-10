import { ErrorCode, PresentationError } from "@common/errors";
import { StringLookUpInputSchema } from "@common/schemas/idValidations";
import { validateDataWithJoi } from "@common/validations";
import { User } from "@features/auth/entities/user";
import { GetUser } from "@features/auth/insfractructure/nest/custom-decorators";
import { DummyUserGuard } from "@features/auth/insfractructure/nest/guards/users.guard";
import {
  ProductCreateInputSchema,
  ProductSearchInputSchema,
  ProductUpdateInputSchema,
} from "@features/business/entities/product";
import { myProductFactory } from "@features/business/factories/product.factory";
import { myRestaurantFactory } from "@features/business/factories/resturant.factory";
import { IProductRepository } from "@features/business/ports/product.repository.definition";
import { IRestaurantRepository } from "@features/business/ports/restaurant.repository.definition";
import {
  ProductCreateInput,
  ProductSearchInput,
  ProductUpdateInput,
} from "@features/business/schema-types";
import { checkAppUserIsOwnerOfRestaurant } from "@features/business/use-cases/permissions";
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

type UpdateProductRequest = ProductUpdateInput["data"];
type CreateProductRequest = ProductCreateInput["data"];

type QueryParams = Required<ProductSearchInput>["searchBy"];

@Controller({
  path: "products",
  version: "1",
})
export class ProductControllerV1 {
  private readonly productRepository: IProductRepository;
  private readonly restaurantRepository: IRestaurantRepository;
  constructor() {
    const { productRepository } = myProductFactory();
    const { restaurantRepository } = myRestaurantFactory();
    this.productRepository = productRepository;
    this.restaurantRepository = restaurantRepository;
  }

  @Get()
  list(@Query() query: QueryParams) {
    validateDataWithJoi(ProductSearchInputSchema, { searchBy: query });

    return this.productRepository.getManyBy({
      searchBy: query,
    });
  }

  @UseGuards(DummyUserGuard)
  @Post(":id/add")
  async create(
    @GetUser() user: User,
    @Body() data: CreateProductRequest,
    @Param("id") resId: string
  ) {
    validateDataWithJoi(ProductCreateInputSchema, { data });
    validateDataWithJoi(StringLookUpInputSchema, { id: resId });
    const appUser = user.appUser;

    const restaurant = await checkAppUserIsOwnerOfRestaurant(
      appUser,
      this.restaurantRepository,
      resId
    );

    const newProduct = await this.productRepository.create({
      ...data,
      restaurantId: restaurant.id,
    });

    return newProduct;
  }

  @Get("/:id")
  async getOne(@Param("id") id: string) {
    validateDataWithJoi(StringLookUpInputSchema, { id });
    const product = await this.productRepository.getOneBy({
      searchBy: { id },
    });
    if (!product) {
      throw new PresentationError("product not found", ErrorCode.NOT_FOUND);
    }
    return product;
  }

  @UseGuards(DummyUserGuard)
  @Patch("/:id")
  async updateOne(
    @Param("id") id: string,
    @Body() data: UpdateProductRequest,
    @GetUser() user: User
  ) {
    validateDataWithJoi(ProductUpdateInputSchema, {
      data,
      searchBy: { id },
    });
    const product = await this.productRepository.getOneBy({
      searchBy: { id },
    });

    if (!product) {
      throw new PresentationError("product not found", ErrorCode.NOT_FOUND);
    }
    await checkAppUserIsOwnerOfRestaurant(
      user.appUser,
      this.restaurantRepository,
      product.restaurantId
    );
    const newProduct = await this.productRepository.update(product, data);

    return newProduct;
  }

  @UseGuards(DummyUserGuard)
  @Delete("/:id")
  async deleteOne(@Param("id") id: string, @GetUser() user: User) {
    validateDataWithJoi(StringLookUpInputSchema, { id });

    const product = await this.productRepository.getOneBy({
      searchBy: { id },
    });

    if (!product) {
      throw new PresentationError("product not found", ErrorCode.NOT_FOUND);
    }

    await checkAppUserIsOwnerOfRestaurant(
      user.appUser,
      this.restaurantRepository,
      product.restaurantId
    );

    await this.productRepository.delete(product);
  }
}
