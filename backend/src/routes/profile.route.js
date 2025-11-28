import express from "express";
const router = express.Router();
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  updateProfile,
  removeCropFromProfile,
  sendOtpforPhoneUpdate,
  verifyOtpForPhoneUpdate,
} from "../controllers/profile.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

router.post(
  "/update-profile",
  verifyJwt,
  upload.single("avatar"),
  updateProfile
);
router.post("/send-otp", verifyJwt, sendOtpforPhoneUpdate);
router.post("/verify-otp", verifyJwt, verifyOtpForPhoneUpdate);

export default router;
