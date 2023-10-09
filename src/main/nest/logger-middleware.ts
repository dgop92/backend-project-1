import morgan from "morgan";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { AppLogger } from "@common/logging/logger";
import { Request, Response, NextFunction } from "express";

// TODO see performance impact of this middleware
// reason: creating a new function for each request

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    return morgan("dev", {
      stream: {
        write: (message: string) => {
          AppLogger.getAppLogger().getLogger().http(message.trim());
        },
      },
    })(req, res, next);
  }
}
