import mongoose from "mongoose";

const cropSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "crop name is required"],
  },
  season: {
    type: String,
    required: [true, "season is required"],
  },
  soilType: {
    type: String,
    required: [true, "soilType is required"],
  },
  idealTemperature: {
    type: String,
    required: [true, "ideal temperature is requird"],
  },
  waterRequirement: {
    type: String,
    required: [true, "water requirement is required"],
  },
  fertilizerRecomendation: {
    type: String,
    required: [true, "fertilizer type is required"],
  },
  pestDiseases: [
    { type: String, required: [true, "pest Diseases are required"] },
  ],
  yieldPerAcre: {
    type: String,
    required: [true, "Yield per acre is required"],
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "CropCategory",
    required: [true, "crop category is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
});

export const Crop = mongoose.model("Crop", cropSchema);
