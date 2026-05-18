import { Tip } from "../models/tip.models.js";
import { Like } from "../models/like.models.js";
import { User } from "../models/user.models.js";
import { TipCategory } from "../models/tipcategory.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { getPublicId } from "../utils/getPublicId.js";

// -------------------- Add Tip --------------------
export const AddTip = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { title, description, category, tips } = req.body; // tips array included
  const tipImagePath = req.file?.path;
  const userId = req.user?._id;

  let uploadedImage;
  if (tipImagePath) {
    try {
      uploadedImage = await uploadOnCloudinary(tipImagePath);
    } catch (err) {
      throw new ApiError(400, "Error while uploading tip Image to Cloudinary");
    }
  } else {
    throw new ApiError(400, "image is required");
  }

  const tipData = {
    imageUrl: uploadedImage.url,
    title,
    description,
    category,
    tips: Array.isArray(tips) ? tips : [tips], // ensure array
    userId,
  };
  console.log(tipData);
  const newTip = await Tip.create(tipData);
  console.log(newTip);
  if (!newTip) throw new ApiError(400, "Failed to create tip");

  return res
    .status(201)
    .json(new ApiResponse(201, "Tip Created Successfully", newTip));
});

// -------------------- Get All Tips --------------------
export const getTips = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId);
  let savedTips = user.tips;
  savedTips = savedTips.map((saved) => saved.toString());

  const tips = await Tip.find({}).populate("category").lean();
  let likedTips = await Like.find({ userId }).distinct("tipId");
  likedTips = likedTips.map((like) => like.toString());

  const updatedTips = tips.map((tip) => ({
    ...tip,
    isLiked: likedTips.includes(tip._id.toString()),
    isSaved: savedTips.includes(tip._id.toString()),
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, "Tips Fetched Successfully", updatedTips));
});

// -------------------- Get Single Tip --------------------
export const getTip = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId);
  let savedTips = user.tips;
  savedTips = savedTips.map((saved) => saved.toString());
  const { tipId } = req.params;
  if (!tipId) throw new ApiError(400, "Tip Id is required");

  const tip = await Tip.findById(tipId).populate("category").lean();
  if (!tip) throw new ApiError(404, "Tip not found");

  const isLiked = await Like.exists({ userId: req.user?._id, tipId });
  const isSaved = savedTips.includes(tip._id.toString());
  tip.isLiked = Boolean(isLiked);
  tip.isSaved = Boolean(isSaved);
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return res
    .status(200)
    .json(new ApiResponse(200, "Tip fetched successfully", tip));
});

// -------------------- Get Tips By Category --------------------
export const getTipsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) throw new ApiError(400, "Category is required");
  const userId = req.user?._id;
  const user = await User.findById(userId);
  let savedTips = user.tips;
  savedTips = savedTips.map((saved) => saved.toString());

  const categoryExists = await TipCategory.findById(categoryId);
  if (!categoryExists) throw new ApiError(400, "Category not found");
  let likedTips = await Like.find({ userId }).distinct("tipId");
  likedTips = likedTips.map((like) => like.toString());

  const tips = await Tip.find({ category: categoryId })
    .populate("category")
    .sort({ createdAt: -1 })
    .lean();
  const updatedTips = tips.map((tip) => ({
    ...tip,
    isLiked: likedTips.includes(tip._id.toString()),
    isSaved: savedTips.includes(tip._id.toString()),
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, "Tips for the Category Fetched", updatedTips));
});

// -------------------- Update Tip --------------------
export const updateTip = asyncHandler(async (req, res) => {
  const { title, description, category, tips } = req.body;
  const { tipId } = req.params;
  const userId = req.user?._id;

  const tip = await Tip.findById(tipId);
  if (!tip) throw new ApiError(404, "Tip not found");

  const user = await User.findById(userId);
  if (user.role === "expert" && !tip.userId.equals(user._id)) {
    throw new ApiError(403, "Access Denied");
  }

  const newImagePath = req.file?.path;
  const updateFields = {};

  if (newImagePath) {
    const uploaded = await uploadOnCloudinary(newImagePath);
    const prevPublicId = getPublicId(tip.imageUrl);
    if (prevPublicId) await deleteFromCloudinary(prevPublicId);
    updateFields.imageUrl = uploaded.url;
  }

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (category) updateFields.category = category;
  if (tips) updateFields.tips = Array.isArray(tips) ? tips : [tips];

  const updatedTip = await Tip.findByIdAndUpdate(tipId, updateFields, {
    new: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Tip updated successfully", updatedTip));
});

// -------------------- Delete Tip --------------------
export const deleteTip = asyncHandler(async (req, res) => {
  const { tipId } = req.params;
  const userId = req.user?._id;

  const tip = await Tip.findById(tipId);
  if (!tip) throw new ApiError(404, "Tip not found");

  const user = await User.findById(userId);
  if (user.role === "expert" && !tip.userId.equals(user._id)) {
    throw new ApiError(403, "Access Denied");
  }

  const publicId = getPublicId(tip.imageUrl);
  if (publicId) await deleteFromCloudinary(publicId);

  await Tip.findByIdAndDelete(tipId);
  await Like.deleteMany({ tipId });
  await User.updateOne({ _id: tip.userId }, { $pull: { tips: tipId } });

  return res.status(200).json(new ApiResponse(200, "Tip deleted successfully"));
});

export const ToggleSaveTip = asyncHandler(async (req, res) => {
  const tipId = req.params.tipId;
  if (!tipId) {
    throw new ApiError(400, "Tip Id is required");
  }

  const userId = req.user?._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  // convert all ObjectIds to string for comparison
  const userTips = user.tips.map((id) => id.toString());
  const isSaved = userTips.includes(tipId.toString());

  if (isSaved) {
    // UNSAVE
    user.tips = user.tips.filter((id) => id.toString() !== tipId.toString());
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Tip Unsaved Successfully", { saved: false }));
  }

  // SAVE
  user.tips.push(tipId); // no duplicates because unsaved case above
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Tip Saved Successfully", { saved: true }));
});
