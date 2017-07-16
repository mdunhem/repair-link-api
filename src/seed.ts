import * as mongoose from "mongoose";
import { Vehicle } from "./models/vehicle";

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

mongoose.connection.on("open", () => {
  mongoose.connection.db.dropDatabase(error => {
    if (error) {
      console.error(error);
      process.exit();
    }

    const vehicle = new Vehicle({ vin: 1, year: 2003, make: "Toyota", vehicleModel: "Corolla" });
    vehicle.save(saveError => {
      if (saveError) {
        console.error(saveError);
      }
    });
  });
});
