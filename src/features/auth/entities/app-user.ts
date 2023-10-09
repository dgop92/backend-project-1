import Joi from "joi";

export type AppUserType = "ADMIN" | "CLIENT";

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  userId: string;
  phone: string;
  address: string;
  type: AppUserType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const AppUserSearchInputSchema = Joi.object({
  searchBy: Joi.object({
    id: Joi.string().optional(),
    userId: Joi.string().min(1).max(128).optional(),
  }).optional(),
}).meta({ className: "AppUserSearchInput" });

export const AppUserCreateInputSchema = Joi.object({
  data: Joi.object({
    firstName: Joi.string().max(120).required(),
    lastName: Joi.string().max(120).required(),
    phone: Joi.string().max(20).required(),
    address: Joi.string().max(255).required(),
    userId: Joi.string().min(1).max(128).required(),
    type: Joi.string().valid("ADMIN", "CLIENT").required(),
  }).required(),
}).meta({ className: "AppUserCreateInput" });

export const AppUserUpdateInputSchema = Joi.object({
  data: Joi.object({
    firstName: Joi.string().max(120).optional(),
    lastName: Joi.string().max(120).optional(),
    phone: Joi.string().max(20).optional(),
    address: Joi.string().max(255).optional(),
    type: Joi.string().valid("ADMIN", "CLIENT").optional(),
  }).required(),
  searchBy: Joi.object({
    id: Joi.string().required(),
  }).required(),
}).meta({ className: "AppUserUpdateInput" });
