import { Response, Request, NextFunction, Router } from "express";

import { Vehicle, VehicleModel } from "../models/vehicle";
import { BaseRouteHandler } from "./base-route";

export class VehiclesRouteHandler extends BaseRouteHandler<VehicleModel> {
  protected uuid = "vin";

  public get put() {
    return (request: Request, response: Response, next: NextFunction) => {
      const { vin, year, make, vehicleModel } = request.body;
      this.collection.findOne({ vin }, (error, existingVehicle) => {
        if (error) {
          return next(error);
        }

        existingVehicle.vin = vin;
        existingVehicle.year = year;
        existingVehicle.make = make;
        existingVehicle.vehicleModel = vehicleModel; // need to change this to vehicleModel

        existingVehicle.save((error, savedVehicle) => {
          if (error) {
            return next(error);
          }
          return response.json(savedVehicle);
        });
      });
    };
  }

  public get post() {
    return (request: Request, response: Response, next: NextFunction) => {
      const { vin, year, make, vehicleModel } = request.body;
      const vehicle = new Vehicle({ vin, year, make, vehicleModel });

      this.collection.findOne({ vin }, (error, existingVehicle) => {
        if (error) {
          return next(error);
        }

        if (existingVehicle) {
          return response.send({ message: "Vehicle with VIN already exists"});
        }

        vehicle.save((error, savedVehicle) => {
          if (error) {
            return next(error);
          }
          return response.json(savedVehicle);
        });
      });
    };
  }

  protected setupRoutes(): void {
    this.router.route("/")
      .get(this.get)
      .post(this.post);

    this.router.route("/:id")
      .get(this.get)
      .put(this.put);
  }
}
