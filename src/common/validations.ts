import Joi from "joi";
import { InvalidInputError } from "./errors";

export function validateDataWithJoi(schema: Joi.ObjectSchema, input: any) {
  const { error } = schema.validate(input);
  if (error) {
    const fieldName = error.details[0].context?.key;
    const errorParams = fieldName ? { fieldName } : {};
    throw new InvalidInputError(error.message, errorParams);
  }
}
