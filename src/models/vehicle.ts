import { model, Model, Document, Schema } from "mongoose";

const VehicleSchema = new Schema({
  vin: { type: String, unique: true },
  year: Number,
  make: String,
  vehicleModel: String
});

export interface VehicleModel extends Document {
  vin: Number;
  year: Number;
  make: String;
  vehicleModel: String;
}

export const Vehicle: Model<VehicleModel> = model<VehicleModel>("Vehicle", VehicleSchema);