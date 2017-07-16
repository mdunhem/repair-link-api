import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import * as mongo from "connect-mongo"; // (session)
import * as path from "path";
import * as mongoose from "mongoose";
import { setupRoutes } from "./routes";


/**
 * Create Express server.
 */
const server = express();
const MongoStore = mongo(session);

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

mongoose.connection.on("error", () => {
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});



/**
 * Express configuration.
 */
server.set("port", process.env.PORT || 3000);
server.use(compression());
server.use(logger(process.env.LOGGERLEVEL || "dev"));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

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

module.exports = server;