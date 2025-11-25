import { Like } from "../models/like.models.js";
import { Tip } from "../models/tip.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

export const toggleLikeTip = asyncHandler(async (req, res) => {
  const tipId = req.params.tipId;
  const userId = req.user._id;

  if (!tipId) throw new ApiError(400, "Tip ID is required");

  const tip = await Tip.findById(tipId);
  if (!tip) throw new ApiError(404, "Tip not found");

  const existingLike = await Like.findOne({ userId, tipId });

  // If already liked → unlike
  if (existingLike) {
    await Like.deleteOne({ userId, tipId });

    const updatedTip = await Tip.findByIdAndUpdate(
      tipId,
      { $inc: { likeCount: -1 } },
      { new: true }
    );

    if (updatedTip.likeCount < 0) {
      updatedTip.likeCount = 0;
      await updatedTip.save();
    }

    return res.status(200).json(
      new ApiResponse(200, "Tip unliked", {
        liked: false,
        updatedTip,
      })
    );
  }

  // If not liked → like now
  await Like.create({ userId, tipId });

  const updatedTip = await Tip.findByIdAndUpdate(
    tipId,
    { $inc: { likeCount: 1 } },
    { new: true }
  );

  res.status(200).json(
    new ApiResponse(200, "Tip liked", {
      liked: true,
      updatedTip,
    })
  );
});
