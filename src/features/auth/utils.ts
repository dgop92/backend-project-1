// created because searchSchema has id optional

import Joi from "joi";

// unknown() is for ignoring extra properties
export const SearchByIdSchema = Joi.object({
  searchBy: Joi.object({
    id: Joi.string().required(),
  }).required(),
}).unknown();

export const SearchByUidSchema = Joi.object({
  searchBy: Joi.object({
    id: Joi.string().min(1).max(128).optional(),
  }).required(),
}).unknown();
