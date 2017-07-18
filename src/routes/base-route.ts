import { Response, Request, NextFunction, Router } from "express";
import { getEntityManager, Repository } from "typeorm";
import { Model, Document } from "mongoose";

export abstract class BaseRouteHandler<T> {
  public router = Router();
  protected repository: Repository<T>;

  constructor(Entity: (new () => T)) {
    this.repository = getEntityManager().getRepository<T>(Entity);
    this.setupMiddleware();
    this.setupRoutes();
  }

  protected setupMiddleware() {
    // Implement any route specific middleware as needed
  }

  public get get() {
    return async (request: Request, response: Response, next: NextFunction) => {
      if (request.params.id) {
        const entity = await this.repository.findOneById(request.params.id);
        if (!entity) {
          response.status(404).send("Item not found").end();
          return;
        }
        response.json(entity);
      } else {
        const entities = await this.repository.find();
        response.json(entities);
      }
    };
  }

  public abstract get put(): (request: Request, response: Response, next: NextFunction) => any;

  public abstract get post(): (request: Request, response: Response, next: NextFunction) => any;

  public abstract get delete(): (request: Request, response: Response, next: NextFunction) => any;

  protected setupRoutes(): void {
    this.router.route("/").get(this.get);
    this.router.route("/:id").get(this.get);
  }
}
