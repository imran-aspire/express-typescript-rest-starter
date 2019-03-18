import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { Request, Response } from "express";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import { AppRoutes } from "./routes/index";
import logger from "./utils/logger";

// define default mongoDb url
const defaultMongoUrl: string = "mongodb://localhost/api-server";

class App {

  public app: express.Application = express();
  public mongoUrl: string = process.env.MONGO_URL || defaultMongoUrl;
  public environment: string = process.env.NODE_ENV;
  public routes: AppRoutes = new AppRoutes();

  constructor() {
    this.config();
    this.mongoSetup();
    this.helloApi();
    this.healthCheck();
    // initialize all routes
    this.routes.set(this.app);
  }

  private config(): void {
    const corsOption: object = {
      headers: "Origin, X-Requested-With, Content-Type, Accept",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      origin: "*",
    };

    this.app.use(cors(corsOption));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    if (this.environment === "development") {
      // Morgan for HTTP request logging
      this.app.use(morgan("dev"));
    }

  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise;
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true }, (err) => {
      if (err) {
        logger.info(err.message);
      } else {
        logger.info("API server is connected to MongoDb");
      }
    });
  }

  private healthCheck(): void {
    // By the time API is up, we are both healthy and ready
    this.app.get(["/health", "/ready"], (request: Request, response: Response): void => {
      response.status(200).send("👍");
    });
  }

  private helloApi(): void {
    // By the time API is up, we are both healthy and ready
    this.app.get("/", (request: Request, response: Response): void => {
      response.status(200).send("Hello, API server 1.0.0");
    });
  }

}

export default new App().app;
