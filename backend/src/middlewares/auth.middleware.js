import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
export const verifyJwt = asyncHandler(async (req, res, next) => {
  console.log(req.cookies);
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    throw new ApiError(400, "UnAuthorized");
  }
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded) {
    throw new ApiError(400, "Invalid Access Token");
  }
  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(400, "Invalid Access Token");
  }
  req.user = user;
  next();
});
