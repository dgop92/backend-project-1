import { Order } from "../entities/order";
import {
  OrderCreateInput,
  OrderSearchInput,
  OrderUpdateInput,
  OrderUpdateStatusInput,
} from "../schema-types";
import { SLPaginationResult } from "@common/types/common-types";

export type OrderCreateRepoData = OrderCreateInput["data"] & {
  restaurantId: string;
  appUserId: string;
};
export type OrderUpdateRepoData = OrderUpdateInput["data"];
export type OrderUpdateStatusRepoData = OrderUpdateStatusInput["data"];

export interface IOrderRepository {
  create(input: OrderCreateRepoData): Promise<Order>;
  update(order: Order, input: OrderUpdateRepoData): Promise<Order>;
  updateStatus(order: Order, input: OrderUpdateStatusRepoData): Promise<Order>;
  delete(order: Order): Promise<void>;
  getOneBy(input: OrderSearchInput): Promise<Order | undefined>;
  getManyBy(input: OrderSearchInput): Promise<SLPaginationResult<Order>>;
}
