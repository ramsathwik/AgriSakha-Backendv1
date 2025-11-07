import mongoose from "mongoose";

const cropSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  soilType: {
    type: String,
    required: true,
  },
  idealTemperature: {
    type: String,
    required: true,
  },
  waterRequirement: {
    type: String,
    required: true,
  },
  fertilizerRecomendation: { type: String, required: true },
  pestDiseases: [{ type: String, required: true }],
  yieldPerAcre: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "CropCategory",
    required: true,
  },
  description: {
    type: String,
    required: ture,
  },
});

export const Crop = mongoose.model("Crop", cropSchema);
