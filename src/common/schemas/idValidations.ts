import Joi from "joi";

export const IntegerLookUpInputSchema = Joi.object({
  id: Joi.number().required(),
}).unknown();

export const StringLookUpInputSchema = Joi.object({
  id: Joi.string().required(),
}).unknown();
