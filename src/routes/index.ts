import { Express, Router, Request, Response } from "express";
import { VehiclesRouteHandler } from "./vehicles";
import { Vehicle } from "../models/vehicle";

const BASEURL = "/api";

export function setupRoutes(server: Express) {
  setupDefaults(server);
  const vehiclesRouteHandler = new VehiclesRouteHandler(Vehicle);
  server.use(`${BASEURL}/vehicles`, vehiclesRouteHandler.router);
}

function setupDefaults(server: Express) {
  server.get("/", (request: Request, response: Response) => {
    response.redirect(`${BASEURL}`);
  });
  server.get(`${BASEURL}`, (request: Request, response: Response) => {
    response.redirect(`${BASEURL}/vehicles`);
  });
}