import mongoose from "mongoose";
const cropCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Category Name is required"] },
    description: {
      type: String,
      required: [true, "Category description is required"],
    },
  },
  { timestamps: true }
);

export const CropCategory = mongoose.model("CropCategory", cropCategorySchema);
