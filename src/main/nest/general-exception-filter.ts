import { BaseError, ErrorCode } from "@common/errors";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

function getStatusCodeFromErrorCode(errorCode: ErrorCode) {
  switch (errorCode) {
    case ErrorCode.INVALID_INPUT:
    case ErrorCode.INVALID_OPERATION:
    case ErrorCode.INVALID_ID:
    case ErrorCode.ID_NOT_PROVIDED:
      return HttpStatus.BAD_REQUEST;
    case ErrorCode.NOT_FOUND:
      return HttpStatus.NOT_FOUND;
    case ErrorCode.DUPLICATED_RECORD:
      return HttpStatus.CONFLICT;
    case ErrorCode.UNAUTHORIZED:
      return HttpStatus.UNAUTHORIZED;
    case ErrorCode.FORBIDDEN:
      return HttpStatus.FORBIDDEN;
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const currentTimestamp = new Date().toISOString();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());

    if (exception instanceof BaseError) {
      const errorCode = exception.errorCode;
      const level = exception.level;
      const message = exception.rawMessage;
      const errorParams = exception.errorParams;
      const statusCode = getStatusCodeFromErrorCode(errorCode);
      const responseBody = {
        statusCode,
        timestamp: currentTimestamp,
        path,
        errorInfo: {
          code: errorCode,
          level,
          message,
          params: errorParams,
        },
      };
      httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
      return;
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const responseBody = {
        statusCode,
        timestamp: currentTimestamp,
        path,
        message: exception.message,
      };
      httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
      return;
    }

    const internalErrorStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = "unknown error";

    if (typeof exception === "object" && exception !== null) {
      if (exception.hasOwnProperty("message")) {
        // @ts-ignore
        errorMessage = exception.message;
      }
    }

    if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    const responseBody = {
      statusCode: internalErrorStatusCode,
      timestamp: currentTimestamp,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: errorMessage,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, internalErrorStatusCode);
  }
}
