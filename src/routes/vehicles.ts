import { Response, Request, NextFunction, Router } from "express";

import { Vehicle } from "../entity/vehicle";
import { BaseRouteHandler } from "./base-route";

export class VehiclesRouteHandler extends BaseRouteHandler<Vehicle> {
  protected uuid = "vin";

  public get put() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const { vin, year, make, model } = request.body;
      const vehicle = await this.repository.findOneById(request.params.id);

      if (vin) {
        vehicle.vin = vin;
      }

      if (year) {
        vehicle.year = year;
      }

      if (make) {
        vehicle.make = make;
      }

      if (model) {
        vehicle.model = model;
      }

      await this.repository.persist(vehicle);

      response.json(vehicle);
    };
  }

  public get post() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const newVehicle = this.repository.create(request.body);

      await this.repository.persist(newVehicle);

      response.json(newVehicle);
    };
  }

  public get delete() {
    return async (request: Request, response: Response, next: NextFunction) => {
      const vehicle = await this.repository.findOneById(request.params.id);
      await this.repository.remove(vehicle);
      response.send({message: `Successfully removed vehicle with VIN: ${vehicle.vin}`});
    };
  }

  protected setupRoutes(): void {
    super.setupRoutes();
    this.router.route("/").post(this.post);
    this.router.route("/:id").put(this.put).delete(this.delete);
  }
}
