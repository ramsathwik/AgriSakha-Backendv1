import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import crypto from "crypto";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let {
    username,
    phoneNumber,
    farmsize,
    state,
    district,
    mandal,
    village,
    crops,
  } = req.body || {};

  const existingUser = await User.findById(userId);
  if (!existingUser) throw new ApiError(404, "User not found");

  const avatarLocalPath = req.file?.path;
  const finalState = state || existingUser.state;
  const finalDistrict = district || existingUser.district;

  if (!finalState || !finalDistrict) {
    throw new ApiError(400, "State and district are required");
  }

  const updatedFields = {
    state: finalState,
    district: finalDistrict,
  };

  let response;
  if (avatarLocalPath) {
    const url = existingUser.imageUrl;
    let right = url.split("/upload/")[1];
    let righttoken = right.split(".")[0];
    let publicId = righttoken.split("/")[1];
    await deleteFromCloudinary(publicId);
    try {
      response = await uploadOnCloudinary(avatarLocalPath);
    } catch (err) {
      console.log(err);
      console.log("error while uploading file to cloud");
    }
  }
  if (response) {
    updatedFields["imageUrl"] = response.url;
  }

  if (username) updatedFields.username = username;

  let isPhoneNumberUpdated = false;
  if (phoneNumber && phoneNumber !== existingUser.phoneNumber) {
    updatedFields.newPhoneNumber = phoneNumber;
    isPhoneNumberUpdated = true;
  }

  if (farmsize) updatedFields.farmsize = farmsize;
  if (mandal) updatedFields.mandal = mandal;
  if (village) updatedFields.village = village;

  if (crops) {
    try {
      updatedFields.crops = JSON.parse(crops);
    } catch {
      throw new ApiError(400, "Invalid crops format. Must be JSON.");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
    runValidators: true,
    new: true,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      isPhoneNumberUpdated
        ? "Verify your mobile number"
        : "User updated successfully",
      {
        ...updatedUser.toObject(),
        phoneVerificationRequired: isPhoneNumberUpdated,
      }
    )
  );
});

export const sendOtpforPhoneUpdate = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (user.newPhoneNumber !== phoneNumber) {
    throw new ApiError(400, "Invalid phone number");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  const hashedToken = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");

  console.log(`Generated OTP for ${phoneNumber}: ${otp}`);

  user.phoneNumberVerificationToken = hashedToken;
  user.phoneNumberVerificationExpiry = expiry;

  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, "OTP sent successfully"));
});

export const verifyOtpForPhoneUpdate = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    throw new ApiError(400, "Phone number or OTP is missing");
  }

  const userId = req.user._id;

  let user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (user.newPhoneNumber !== phoneNumber) {
    throw new ApiError(400, "Invalid phone number");
  }

  // Check expiry
  if (
    !user.phoneNumberVerificationExpiry ||
    Date.now() > user.phoneNumberVerificationExpiry
  ) {
    throw new ApiError(400, "OTP expired");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");

  if (hashedToken !== user.phoneNumberVerificationToken) {
    throw new ApiError(400, "Incorrect OTP");
  }

  // Final update
  user.phoneNumber = phoneNumber;
  user.newPhoneNumber = undefined;
  user.phoneNumberVerificationToken = undefined;
  user.phoneNumberVerificationExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, "Phone number updated successfully"));
});

export const removeCropFromProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cropId = req.params.cropId;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { crops: cropId } },
    { new: true }
  );

  if (!updatedUser) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Crop removed successfully", updatedUser));
});
