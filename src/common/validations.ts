import Joi from "joi";
import { InvalidInputError } from "./errors";

export function validateDataWithJoi<T = any>(
  schema: Joi.ObjectSchema<T>,
  input: any
) {
  const { error, value } = schema.validate(input);
  if (error) {
    const fieldName = error.details[0].context?.key;
    const errorParams = fieldName ? { fieldName } : {};
    throw new InvalidInputError(error.message, errorParams);
  }
  return value;
}
