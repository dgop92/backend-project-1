import "reflect-metadata";
import { AppLogger } from "@common/logging/logger";
import { WinstonLogger, createDevLogger } from "@common/logging/winston-logger";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { INestApplication, VersioningType } from "@nestjs/common";
import { AppModule } from "./nest/app.module";
import { AllExceptionsFilter } from "./nest/general-exception-filter";
import { setupFactories } from "./setup-factories";
import { APP_ENV_VARS } from "@common/config/app-env-vars";
import { closeMongoConnection, getMongoDatabase } from "./mongo-client";

const logger = createDevLogger();
const winstonLogger = new WinstonLogger(logger);

AppLogger.getAppLogger().setLogger(winstonLogger);
const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

myLogger.info("app logger created");

let app: INestApplication;

async function startApp() {
  const { mongoDatabase } = await getMongoDatabase();

  setupFactories(mongoDatabase);

  app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  app.enableCors({
    origin: APP_ENV_VARS.cors.allowOrigins,
  });
  await app.listen(APP_ENV_VARS.port);
}

function closeServices() {
  try {
    myLogger.info("closing mongo connection");
    closeMongoConnection();
    if (app) {
      myLogger.info("closing http server");
      app.close();
    }
  } catch (error) {
    myLogger.error("error closing services", { error });
  }
}

process.on("unhandledRejection", (reason, promise) => {
  myLogger.error("unhandled rejection, node process will finish", {
    reason,
    promise,
  });
  process.exitCode = 1;
});

process.on("uncaughtException", (err) => {
  myLogger.error("uncaught exception, node process will finish", { err });
  myLogger.info("cleaning up services");
  closeServices();
  process.exitCode = 1;
});

process.on("SIGINT", function () {
  myLogger.info("cleaning up services");
  closeServices();
  process.exit(2);
});

process.on("exit", function () {
  // NOTE: this will be called when the node process finishes,
  // either because of an error or because of a normal exit
  // cannot clenaup services here because if the error happens and
  // one service is still running this event will never be called
  // Example mongo db connections is still open but rabbitmq fail to connect
  myLogger.info("node process will exit");
});

startApp()
  .then(() => {
    myLogger.info("app started successfully");
  })
  .catch((err) => {
    // NOTE: errors thrown by startApp() will be caught here,
    // we can call them boot errors
    myLogger.error("app failed to start, node process will finish", { err });
    process.exitCode = 1;
    myLogger.info("cleaning up services");
    closeServices();
  });
