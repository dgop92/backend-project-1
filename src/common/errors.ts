type ErrorLevel = "application" | "repository" | "presentation";

export enum ErrorCode {
  INVALID_INPUT = "invalid-input",
  INVALID_ID = "invalid-id",
  INVALID_OPERATION = "invalid-operation",
  DUPLICATED_RECORD = "duplicated-record",
  ID_NOT_PROVIDED = "id-not-provided",
  NOT_FOUND = "not-found",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  APPLICATION_INTEGRITY_ERROR = "application-integrity-error",
}

export interface BaseErrorParams {
  [key: string]: any;
}

export class BaseError extends Error {
  public rawMessage: string;

  constructor(
    rawMessage: string,
    public errorCode: ErrorCode,
    public level: ErrorLevel,
    public errorParams: BaseErrorParams = {}
  ) {
    super(`[${new Date().toISOString()}] - [${level}] ${rawMessage}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError);
    }

    this.rawMessage = rawMessage;
  }
}

// Custom level errors

export class ApplicationError extends BaseError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    errorParams: BaseErrorParams = {}
  ) {
    super(message, errorCode, "application", errorParams);
  }
}

export class RepositoryError extends BaseError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    errorParams: BaseErrorParams = {}
  ) {
    super(message, errorCode, "repository", errorParams);
  }
}

export class PresentationError extends BaseError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    errorParams: BaseErrorParams = {}
  ) {
    super(message, errorCode, "presentation", errorParams);
  }
}

// Application errors

export interface InvalidInputErrorParams extends BaseErrorParams {
  fieldName?: string;
}

export class InvalidInputError extends ApplicationError {
  constructor(message: string, errorParams: InvalidInputErrorParams = {}) {
    super(message, ErrorCode.INVALID_INPUT, errorParams);
  }
}
