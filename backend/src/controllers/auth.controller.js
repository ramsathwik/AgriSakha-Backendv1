import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

import crypto from "crypto";

async function generateAccessAndRefreshToken(Id) {
  const user = await User.findById(Id);
  if (!user) {
    throw new ApiError(400, "User Not Found");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
}

export const sendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    throw new ApiError(400, "phoneNumber is required");
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    throw new ApiError(400, "User Not registered");
  }
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const hashedToken = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins

  console.log(`Generated OTP for ${phoneNumber}: ${otp}`); // For testing
  // TODO: send OTP via SMS using Twilio, Fast2SMS, etc.
  user.phoneNumberVerificationToken = hashedToken;
  user.phoneNumberVerificationExpiry = expiry;

  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, "Otp Sent Successfully"));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    throw new ApiError(400, "Phone Number or otp is missing");
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    throw new ApiError(400, "User Not Found");
  }
  const hashedToken = crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");

  const currentTime = Date.now();
  if (
    !user.phoneNumberVerificationExpiry ||
    Date.now() > user.phoneNumberVerificationExpiry.getTime()
  ) {
    throw new ApiError(400, "Otp Expired");
  }

  if (user.phoneNumberVerificationToken != hashedToken) {
    throw new ApiError(400, "invalid Otp");
  }

  user.phoneNumberVerificationToken = undefined;
  user.phoneNumberVerificationExpiry = undefined;
  user.isVerified = true;
  await user.save({ validateBeforeSave: false });
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const newuser = await User.findById(user._id).select(
    "-password -refreshToken -isVerified -phoneNumberVerificationToken -phoneNumberVerificationExpiry"
  );
  if (!newuser) {
    throw new ApiError(400, "User Not Found");
  }
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.status(200).json(
    new ApiResponse(200, "Registered In Successfully", {
      user: newuser,
      accessToken,
      refreshToken,
    })
  );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!incomingToken) {
    throw new ApiError(400, "No Refresh Token");
  }
  try {
    const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

    const userId = decoded._id;
    const newuser = await User.findById(userId);
    if (!newuser) {
      throw new ApiError(400, "User Not Found");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(newuser._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // true in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json(
      new ApiResponse(200, "accessToken Refreshed Successfully", {
        accessToken,
        newRefreshToken,
      })
    );
  } catch (err) {
    console.log(err);
    throw new ApiError(400, "Invalid or Expired RefreshToken");
  }
});

export const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    phoneNumber,
    password,
    farmsize,
    state,
    district,
    mandal,
    village,
    role,
  } = req.body || {};

  // Basic validation
  const isExists = await User.findOne({ phoneNumber });
  console.log(isExists);

  if (isExists) {
    if (isExists.isVerified) {
      throw new ApiError(400, "User Already Exists");
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "User created successfully. Please verify your mobile number."
          )
        );
    }
  }

  // Upload avatar if available
  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);
  let avatar = null;
  if (avatarLocalPath) {
    try {
      avatar = await uploadOnCloudinary(avatarLocalPath);
      console.log("Avatar uploaded to Cloudinary:", avatar);
    } catch (err) {
      console.log("Error uploading to Cloudinary:", err);
      throw new ApiError(400, "Error while uploading to Cloudinary");
    }
  }

  // Create user
  const user = await User.create({
    imageUrl: avatar?.url || null,
    username,
    phoneNumber,
    password,
    farmsize: farmsize || 0,
    state,
    district,
    mandal: mandal || "",
    village: village || "",
    role,
    isVerified: false,
  });

  if (!user) {
    throw new ApiError(400, "Error while creating the user");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "User created successfully. Please verify your mobile number."
      )
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = await User.findOne({ phoneNumber: phoneNumber });
  console.log(phoneNumber, password);
  if (!user) {
    throw new ApiError(400, "User Not Found");
  }
  const isUserverified = user.isVerified;
  if (!isUserverified) {
    throw new ApiError(400, "mobile Number not verified");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const newuser = await User.findById(user._id).select(
    "-password -refreshToken -isVerified -phoneNumberVerificationToken -phoneNumberVerificationExpiry"
  );

  if (!newuser) {
    throw new ApiError(400, "User Not Found");
  }
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json(
    new ApiResponse(200, "Logged In Successfully", {
      user: newuser,
      accessToken,
      refreshToken,
    })
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User Not Found");
  }
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 },
  });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json(
    new ApiResponse(200, "LogOut Successfully", {
      accessToken: "",
      refreshToken: "",
    })
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    // 1. Read access token from cookies
    const accessToken = req.cookies?.accessToken;
    console.log(accessToken);

    if (!accessToken) {
      throw new ApiError(401, "Not logged in");
    }

    // 2. Verify the access token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError(401, "Access token expired");
    }

    // 3. Find user
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken -phoneNumberVerificationToken -phoneNumberVerificationExpiry"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 4. Return user info
    res.status(200).json(
      new ApiResponse(200, "User authenticated", {
        user,
      })
    );
  } catch (error) {
    // If access token expired, try refresh
    return res
      .status(401)
      .json(new ApiResponse(401, "Invalid or expired token"));
  }
});
