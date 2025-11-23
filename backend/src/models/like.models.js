import mongoose from "mongoose";

const likesSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tipId: {
    type: mongoose.Types.ObjectId,
    ref: "Tip",
    required: true,
  },
});

likesSchema.index({ userId: 1, tipId: 1 }, { unique: true });
export const Like = mongoose.model("Like", likesSchema);
