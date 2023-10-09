import Joi from "joi";

export const SkipLimitPaginationSchema = Joi.object({
  limit: Joi.number()
    .positive()
    .max(500)
    .optional()
    .description("Limit results per request, max 500. must be used with skip"),
  skip: Joi.number()
    .positive()
    .optional()
    .description("Skips results per request. must be used with limit"),
}).optional();
