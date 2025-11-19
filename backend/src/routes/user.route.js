import express from "express";
const router = express.Router();
import {
  registerUser,
  verifyOtp,
  loginUser,
  refreshAccessToken,
  logoutUser,
  sendOtp,
} from "../controllers/auth.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import {
  registerUserValidator,
  loginValidator,
} from "../validators/auth.validators.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post(
  "/register-user",
  upload.single("avatar"),
  registerUserValidator(),
  validate,
  registerUser
);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp", sendOtp);
router.post("/login-user", loginValidator(), validate, loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout-user", verifyJwt, logoutUser);

export default router;
