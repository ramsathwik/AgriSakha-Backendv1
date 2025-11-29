import { Crop } from "../models/crop.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const addCrop = asyncHandler(async (req, res) => {
  const {
    name,
    season,
    soilType,
    idealTemperature,
    waterRequirement,
    fertilizerRecomendation,
    pestDieseases,
    yieldPerAcre,
    category,
    description,
  } = req.body;
  const newCrop = await Crop.create({
    name,
    season,
    soilType,
    idealTemperature,
    waterRequirement,
    fertilizerRecomendation,
    pestDieseases,
    yieldPerAcre,
    category,
    description,
  });

  if (!newCrop) {
    throw new ApiError(400, "Failed add Add Crop");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Successfully Added New Crop", newCrop));
});

export const updateCrop = asyncHandler(async (req, res) => {
  const cropId = req.params.cropId;
  if (!cropId) {
    throw new ApiError(400, "Crop Id Required");
  }
  const {
    name,
    season,
    soilType,
    idealTemperature,
    waterRequirement,
    fertilizerRecomendation,
    pestDieseases,
    yieldPerAcre,
    category,
    description,
  } = req.body;
  const updateFields = {};
  if (name) {
    updateFields["name"] = name;
  }
  if (season) {
    updateFields["season"] = season;
  }
  if (soilType) {
    updateFields["soilType"] = soilType;
  }
  if (idealTemperature) {
    updateFields["idealTemperature"] = idealTemperature;
  }
  if (waterRequirement) {
    updateFields["waterRequirement"] = waterRequirement;
  }
  if (fertilizerRecomendation) {
    updateFields["fertilizerRecomendation"] = fertilizerRecomendation;
  }
  if (pestDieseases) {
    updateFields["pestDieseases"] = pestDieseases;
  }
  if (yieldPerAcre) {
    updateFields["yieldPerAcre"] = yieldPerAcre;
  }
  if (category) {
    updateFields["category"] = category;
  }
  if (description) {
    updateFields["description"] = description;
  }
  const updatedCrop = await Crop.findByIdAndUpdate(cropId, updateFields, {
    new: true,
  });
  if (!updatedCrop) {
    throw new ApiError(404, "Crop Not Found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Crop Updated Successfully", updatedCrop));
});

export const deleteCrop = asyncHandler(async (req, res) => {
  const cropId = req.params.cropId;
  if (!cropId) {
    throw new ApiError(400, "Crop Id is Required");
  }
  const deletedCrop = await Crop.findByIdAndDelete(cropId);
  if (!deletedCrop) {
    throw new ApiError(400, "Crop Not Found");
  }
  res.status(200).json(new ApiResponse(200, "Crop Deleted Successfully"));
});

export const getCrops = asyncHandler(async (req, res) => {
  const crops = await Crop.find();
  res
    .status(200)
    .json(new ApiResponse(200, "Crops fetched Successfully", crops));
});

export const getCrop = asyncHandler(async (req, res) => {
  const cropId = req.params.cropId;
  if (!cropId) {
    throw new ApiError(400, "Crop Id Is Required");
  }
  const crop = await Crop.findById(cropId).populate("category");
  if (!crop) {
    throw new ApiError(400, "Crop Not Found");
  }
  res.status(200).json(new ApiResponse(200, "Crop Fetched Successfully", crop));
});
