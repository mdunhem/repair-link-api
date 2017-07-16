import { Response, Request, NextFunction, Router } from "express";
import { Model, Document } from "mongoose";

export abstract class BaseRouteHandler<T extends Document> {
  public router = Router();
  protected collection: Model<T>;
  protected uuid = "id";

  constructor(collection: Model<T>) {
    this.collection = collection;
    this.setupMiddleware();
    this.setupRoutes();
  }

  protected setupMiddleware() {
    // Implement any route specific middleware as needed
  }

  private validateResponse(response: Response, items?: Document[]) {
    if (!items || !items.length) {
      response.status(404).send("Item not found");
      return false;
    }
    return true;
  }

  public get get() {
    return (request: Request, response: Response, next: NextFunction) => {
      if (request.params.id) {
        this.collection.find({ [this.uuid]: request.params.id }, (error, items) => {
          if (error) {
            response.send(error);
          }

          response.json(items[0]);
        });
      } else {
        this.collection.find((error, items) => {
          if (error) {
            response.send(error);
          }

          response.json(items);
        });
      }
    };
  }

  public abstract get put(): (request: Request, response: Response, next: NextFunction) => any;

  public abstract get post(): (request: Request, response: Response, next: NextFunction) => any;

  protected abstract setupRoutes(): void;
}