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
    tips: [{ type: String, required: true }],

    likeCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "TipCategory",
    },
  },
  { timestamps: true }
);

export const Tip = mongoose.model("Tip", tipSchema);
