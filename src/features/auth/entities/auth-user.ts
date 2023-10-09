import Joi from "joi";

export interface AuthUser {
  id: string;
  email: string;
}

export const AuthUserSearchInputSchema = Joi.object({
  searchBy: Joi.object({
    id: Joi.string().min(1).max(128).optional(),
    email: Joi.string().email().max(200).optional(),
  }).optional(),
}).meta({ className: "AuthUserSearchInput" });

export const AuthUserCreateInputSchema = Joi.object({
  data: Joi.object({
    email: Joi.string().email().max(200).required(),
    // Password must have at least 8 characters, an uppercase letter, a lowercase letter and a number
    password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&-]{8,100}$/)
      .required(),
  }).required(),
}).meta({ className: "AuthUserCreateInput" });
