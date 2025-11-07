import mongoose from "mongoose";

const tipSchema = mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "TipCategory",
    },
  },
  { timestamps: true }
);

export const Tip = mongoose.model("Tip", tipSchema);
