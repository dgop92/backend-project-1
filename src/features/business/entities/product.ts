import Joi from "joi";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const ProductSearchInputSchema = Joi.object({
  searchBy: Joi.object({
    id: Joi.string().optional(),
    restaurantId: Joi.string().optional(),
    category: Joi.string().optional(),
  }).optional(),
}).meta({ className: "ProductSearchInput" });

export const ProductCreateInputSchema = Joi.object({
  data: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(1000).required(),
    category: Joi.string().min(1).max(255).required(),
    price: Joi.number().positive().required(),
  }).required(),
}).meta({ className: "ProductCreateInput" });

export const ProductUpdateInputSchema = Joi.object({
  data: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(1000).optional(),
    category: Joi.string().min(1).max(255).optional(),
    price: Joi.number().positive().optional(),
  }).required(),
  searchBy: Joi.object({
    id: Joi.string().required(),
  }).required(),
}).meta({ className: "ProductUpdateInput" });
