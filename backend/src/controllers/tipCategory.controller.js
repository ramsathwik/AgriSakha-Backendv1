// TipCategory API Write controllers + routes for:
// POST /category → Admin/Expert only
// GET /categories → Everyone (farmer, expert, admin)
// PUT /category/:id → Admin only
// DELETE /category/:id → Admin only

import { TipCategory } from "../models/tipcategory.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

export const addCategory = asyncHandler(async (req, res) => {
  let { name, description } = req.body;
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "User Not Found");
  }
  name = name.toLowerCase();
  const isAlreadyExists = await TipCategory.findOne({ name });
  if (isAlreadyExists) {
    throw new ApiError(400, "Category already Exists");
  }
  const newCategory = await TipCategory.create({
    name,
    description,
    createdBy: userId,
  });
  if (!newCategory) {
    throw new ApiError(400, "Something went wrong while created category");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "Category created successfully", newCategory));
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await TipCategory.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, "Categories fetched Successfully", categories));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    throw new ApiError(400, "categoryId is required");
  }

  if (!req.body) {
    throw new ApiError(400, "Name or Description is required");
  }

  const { name, description } = req.body;

  const updatefields = {};

  // Only validate name if provided
  if (name) {
    const lowerCaseName = name.toLowerCase();

    const isExists = await TipCategory.findOne({ name: lowerCaseName });

    // Prevent duplicate name except same category
    if (isExists && isExists._id.toString() !== categoryId) {
      throw new ApiError(400, "Category already exists");
    }

    updatefields.name = lowerCaseName;
  }

  if (description) {
    updatefields.description = description;
  }

  const updated = await TipCategory.findByIdAndUpdate(
    categoryId,
    updatefields,
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(400, "Something went wrong while updating");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Category updated successfully", updated));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    throw new ApiError(400, "CategoryId is required");
  }
  const deletedCategory = await TipCategory.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    throw new ApiError(400, "Category is not Available");
  }
  res.status(200).json(new ApiResponse(200, "Category Deleted Successfully"));
});
