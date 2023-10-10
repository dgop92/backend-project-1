import { Product } from "../entities/product";
import {
  ProductCreateInput,
  ProductSearchInput,
  ProductUpdateInput,
} from "../schema-types";
import { SLPaginationResult } from "@common/types/common-types";

export type ProductCreateRepoData = ProductCreateInput["data"] & {
  restaurantId: string;
};
export type ProductUpdateRepoData = ProductUpdateInput["data"];

export interface IProductRepository {
  create(input: ProductCreateRepoData): Promise<Product>;
  update(product: Product, input: ProductUpdateRepoData): Promise<Product>;
  delete(product: Product): Promise<void>;
  getOneBy(input: ProductSearchInput): Promise<Product | undefined>;
  getManyBy(input: ProductSearchInput): Promise<SLPaginationResult<Product>>;
}
