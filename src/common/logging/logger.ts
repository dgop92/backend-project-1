import path from "path";

export type LoggerFunc = (
  message: string,
  meta?: { [key: string]: any }
) => void;

export interface ILogger {
  fatal: LoggerFunc;
  error: LoggerFunc;
  warn: LoggerFunc;
  info: LoggerFunc;
  http: LoggerFunc;
  debug: LoggerFunc;
}
// Singleton pattern
export class AppLogger {
  private constructor() {}

  private static _instance: AppLogger;
  private logger!: ILogger;

  public static getAppLogger(): AppLogger {
    if (!this._instance) this._instance = new AppLogger();

    return this._instance;
  }

  setLogger(logger: ILogger) {
    this.logger = logger;
  }

  getLogger(): ILogger {
    return this.logger;
  }

  createFileLogger(fullFilenamePath: string): ILogger {
    const filename = path.basename(fullFilenamePath);
    const fileLogger: ILogger = {
      fatal: (message, meta) => {
        this.logger.fatal(message, { ...meta, filename });
      },
      error: (message, meta) => {
        this.logger.error(message, { ...meta, filename });
      },
      warn: (message, meta) => {
        this.logger.warn(message, { ...meta, filename });
      },
      info: (message, meta) => {
        this.logger.info(message, { ...meta, filename });
      },
      http: (message, meta) => {
        this.logger.http(message, { ...meta, filename });
      },
      debug: (message, meta) => {
        this.logger.debug(message, { ...meta, filename });
      },
    };
    return fileLogger;
  }
}
