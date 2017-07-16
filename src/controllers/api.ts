import { Response, Request, NextFunction, Router } from "express";

const VEHICLES = [
  {make: "Ford", model: "Taurus"},
  {make: "Toyota", model: "Corolla"}
];

export let router = Router();

router.route("/").get(getApi);

router.route("/test").get(test);

router.route("/vehicles")
  .get(getVehicles)
  .post(postNewVehicle);

function getApi(req: Request, res: Response) {
  res.send({ test: "It worked!!" });
}

function getVehicles(request: Request, response: Response) {
  response.send(VEHICLES);
}

function postNewVehicle(request: Request, response: Response) {
  const {make, model} = request.body;
  const vehicle = {make: make, model: model};

  VEHICLES.push(vehicle);
  response.send({ message: "Vehicle added" });
}

function test(request: Request, response: Response) {
  response.send({ message: "The test function worked" });
}

