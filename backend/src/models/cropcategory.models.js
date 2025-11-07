const cropCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const CropCategory = mongoose.model("CropCategory", cropCategorySchema);
