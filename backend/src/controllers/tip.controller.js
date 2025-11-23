// Tip API Write controllers + routes for:
// POST /tip → Expert (and optionally farmer)
// GET /tips → Everyone
// GET /tip/:id → Everyone
// PUT /tip/:id → Only creator or admin
// DELETE /tip/:id → Only creator or admin
// POST /tip/:id/like → Everyone explain all these routes what they doi dont give me code
import { Tip } from "../models/tip.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { getPublicId } from "../utils/getPublicId.js";

export const AddTip = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const tipImagePath = req.file?.path;
  const userId = req.user?._id;
  let uploadedImage;
  if (tipImagePath) {
    try {
      uploadedImage = await uploadOnCloudinary(tipImagePath);
      console.log("image uploaded ", uploadedImage);
    } catch (err) {
      console.log("error ", err);
      throw new ApiError(400, "Error while uploading tip Image to Cloudinary");
    }
  }
  let tipData = { title, description, category, userId };
  if (uploadedImage) {
    tipData["imageUrl"] = uploadedImage?.url;
  }
  let newTip = await Tip.create(tipData);
  if (!newTip) {
    throw new ApiError(400, "Something went wrong while creating the tip");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "Tip Created Successfully", newTip));
});

export const getTips = asyncHandler(async (req, res) => {
  //   const tips = await Tip.aggregate([
  //     {
  //       $lookup: {
  //         from: "likes",
  //         localField: "_id",
  //         foreignField: "tipId",
  //         as: "likes"
  //       }
  //     },
  //     {
  //       $addFields: {
  //         likeCount: { $size: "$likes" }
  //       }
  //     }
  //   ]);
  const tips = await Tip.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, "Tips Fetched Successfully", tips));
});

export const getTip = asyncHandler(async (req, res) => {
  const tipId = req.params.tipId;

  if (!tipId) {
    throw new ApiError(400, "Tip Id is required");
  }

  const tip = await Tip.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(tipId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tipId",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
      },
    },
  ]);

  if (tip.length === 0) {
    throw new ApiError(400, "Invalid Tip Id Provided");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tip fetched Successfully", tip[0]));
});

export const updateTip = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const tipId = req.params.tipId;

  let tip = await Tip.findById(tipId);
  if (!tip) throw new ApiError(404, "Tip not found");

  const newImagePath = req.file?.path;
  let updateFields = {};

  if (newImagePath) {
    const uploaded = await uploadOnCloudinary(newImagePath);

    const prevPublicId = getPublicId(tip.imageUrl);
    if (prevPublicId) deleteFromCloudinary(prevPublicId);

    updateFields["imageUrl"] = uploaded.url;
  }

  if (title) updateFields["title"] = title;
  if (description) updateFields["description"] = description;
  if (category) updateFields["category"] = category;

  const updatedTip = await Tip.findByIdAndUpdate(
    tipId,
    { $set: updateFields },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Tip updated successfully", updatedTip));
});

export const deleteTip = asyncHandler(async (req, res) => {
  const tipId = req.params.tipId;

  const tip = await Tip.findById(tipId);
  if (!tip) throw new ApiError(404, "Tip not found");

  const publicId = getPublicId(tip.imageUrl);
  if (publicId) await deleteFromCloudinary(publicId);

  await Tip.findByIdAndDelete(tipId);
  await Like.deleteMany({ tipId });

  res.status(200).json(new ApiResponse(200, "Tip deleted successfully"));
});
