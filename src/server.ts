import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as path from "path";
import * as cors from "cors";
import { setupRoutes } from "./routes";


/**
 * Options for cross origin support
 */
const corsOptions: cors.CorsOptions = {
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  credentials: true,
  methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
  origin: "*",
  preflightContinue: false
};

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [
      __dirname + "/entity/*.js"
  ]
};

createConnection(connectionOptions).then(async connection => {
  const server = express();

  /**
   * Express configuration.
   */
  server.set("port", process.env.PORT || 3000);
  server.use(compression());
  server.use(logger(process.env.LOGGERLEVEL || "dev"));
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(cors(corsOptions));

  /**
   * Set up routes
   */
  setupRoutes(server);

  /**
   * Error Handler. Provides full stack - remove for production
   */
  server.use(errorHandler());

  /**
   * Start Express server.
   */
  server.listen(server.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), server.get("port"), server.get("env"));
    console.log("  Press CTRL-C to stop\n");
  });
}).catch(error => console.log(error));
