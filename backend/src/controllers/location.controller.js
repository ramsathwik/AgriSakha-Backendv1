import { State } from "../models/state.models.js";
import { District } from "../models/district.models.js";
import { Mandal } from "../models/mandal.models.js";
import { Village } from "../models/village.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const getStates = asyncHandler(async (req, res) => {
  const states = await State.find({});
  return res.status(200).json(new ApiResponse(200, "Success", states));
});

export const getDistricts = asyncHandler(async (req, res) => {
  const stateId = req.query?.state;
  if (!stateId) {
    throw new ApiError(400, "State Not Provided");
  }
  const districts = await District.find({ state: stateId });
  if (districts.length == 0) {
    throw new ApiError(400, "Invalid State");
  }
  return res.status(200).json(new ApiResponse(200, "Success", districts));
});

export const getMandals = asyncHandler(async (req, res) => {
  const districtId = req.query?.district;
  if (!districtId) {
    throw new ApiError(400, "District Not Provided");
  }
  console.log(districtId);
  const mandals = await Mandal.find({ district: districtId });
  if (mandals.length == 0) {
    throw new ApiError(400, "Invalid District");
  }
  return res.status(200).json(new ApiResponse(200, "Success", mandals));
});

export const getVillages = asyncHandler(async (req, res) => {
  const mandalId = req.query?.mandal;
  if (!mandalId) {
    throw new ApiError(400, "Mandal Not Provided");
  }
  console.log(mandalId);
  const villages = await Village.find({ mandal: mandalId });
  if (villages.length == 0) {
    throw new ApiError(400, "Invalid Mandal");
  }
  return res.status(200).json(new ApiResponse(200, "Success", villages));
});
