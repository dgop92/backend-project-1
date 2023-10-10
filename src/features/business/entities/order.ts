import { Product } from "./product";
import Joi from "joi";

export type OrderStatus =
  | "created"
  | "in-progress"
  | "on-the-way"
  | "delivered";

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  appUserId: string;
  restaurantId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const OrderSearchInputSchema = Joi.object({
  searchBy: Joi.object({
    id: Joi.string().optional(),
    restaurantId: Joi.string().optional(),
    appUserId: Joi.string().optional(),
  }).optional(),
  filterBy: Joi.object({
    status: Joi.string()
      .valid("created", "in-progress", "on-the-way", "delivered")
      .optional(),
  }).optional(),
}).meta({ className: "OrderSearchInput" });

export const OrderItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().positive().required(),
}).meta({ className: "OrderItem" });

export const OrderCreateInputSchema = Joi.object({
  data: Joi.object({
    items: Joi.array().items(OrderItemSchema).min(1).required(),
  }).required(),
}).meta({ className: "OrderCreateInput" });

export const OrderUpdateInputSchema = Joi.object({
  data: Joi.object({
    itemsToAdd: Joi.array().items(OrderItemSchema).optional(),
    productsToRemove: Joi.array().items(Joi.string().required()).optional(),
    itemsToUpdate: Joi.array().items(OrderItemSchema).optional(),
  }).required(),
  searchBy: Joi.object({
    id: Joi.string().required(),
  }).required(),
}).meta({ className: "OrderUpdateInput" });

export const OrderUpdateStatusInputSchema = Joi.object({
  data: Joi.object({
    status: Joi.string()
      .valid("in-progress", "on-the-way", "delivered")
      .required(),
  }).required(),
  searchBy: Joi.object({
    id: Joi.string().required(),
  }).required(),
}).meta({ className: "OrderUpdateStatusInput" });
