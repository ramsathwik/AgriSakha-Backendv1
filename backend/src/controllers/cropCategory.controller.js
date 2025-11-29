import { CropCategory } from "../models/cropcategory.models.js";
import { Crop } from "../models/crop.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Create Category
export const addCropCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const newCategory = await CropCategory.create({ name, description });

  if (!newCategory) {
    throw new ApiError(400, "Failed to create category");
  }

  res
    .status(201)
    .json(new ApiResponse(201, "Created category successfully", newCategory));
});

// Update Category
export const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    throw new ApiError(400, "Category Id is required");
  }

  const { name, description } = req.body;

  if (!name && !description) {
    throw new ApiError(400, "Name or Description is required");
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (description) updateFields.description = description;

  const updatedCategory = await CropCategory.findByIdAndUpdate(
    categoryId,
    updateFields,
    { new: true }
  );

  if (!updatedCategory) {
    throw new ApiError(400, "Failed to update the category");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Successfully updated the category", updatedCategory)
    );
});

// Delete Category
export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    throw new ApiError(400, "Category Id is required");
  }

  const deletedCategory = await CropCategory.findByIdAndDelete(categoryId);

  if (!deletedCategory) {
    throw new ApiError(400, "Category Not Found");
  }
  await Crop.deleteMany({ category: categoryId });

  res.status(200).json(new ApiResponse(200, "Successfully deleted category"));
});

// Fetch All Categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await CropCategory.find();
  res
    .status(200)
    .json(new ApiResponse(200, "Successfully fetched categories", categories));
});
