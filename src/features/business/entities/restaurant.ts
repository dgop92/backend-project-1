import Joi from "joi";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  category: string;
  popularity: number;
  appUserId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const RestaurantSearchInputSchema = Joi.object({
  searchBy: Joi.object({
    id: Joi.string().optional(),
    name: Joi.string().min(1).max(255).optional(),
    category: Joi.string().min(1).max(255).optional(),
    appUserId: Joi.string().optional(),
  }).optional(),
}).meta({ className: "RestaurantSearchInput" });

export const RestaurantCreateInputSchema = Joi.object({
  data: Joi.object({
    address: Joi.string().max(255).required(),
    category: Joi.string().min(1).max(255).required(),
    name: Joi.string().min(1).max(255).required(),
  }).required(),
}).meta({ className: "RestaurantCreateInput" });

export const RestaurantUpdateInputSchema = Joi.object({
  data: Joi.object({
    address: Joi.string().max(255).optional(),
    category: Joi.string().min(1).max(255).optional(),
    name: Joi.string().min(1).max(255).optional(),
  }).required(),
  searchBy: Joi.object({
    id: Joi.string().required(),
  }).required(),
}).meta({ className: "RestaurantUpdateInput" });
