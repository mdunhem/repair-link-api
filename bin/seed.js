const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  vin: { type: String, unique: true },
  year: Number,
  make: String,
  vehicleModel: String
});

const Vehicle = mongoose.model("Vehicle", VehicleSchema);

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);

mongoose.connection.on("open", () => {
  mongoose.connection.db.dropDatabase(error => {
    if (error) {
      throw error;
    }

    const vehicle = new Vehicle({ vin: "FE1", year: 2003, make: "Toyota", vehicleModel: "Corolla" });
    vehicle.save(saveError => {
      if (saveError) {
        throw saveError;
      } else {
        console.log("Seeded the db");
        process.exit();
      }
    });
  });
});
