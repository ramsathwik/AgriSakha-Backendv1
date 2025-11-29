import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  addCrop,
  updateCrop,
  deleteCrop,
  getCrops,
  getCrop,
} from "../controllers/crop.controller.js";
const router = express.Router();

router.post("/add-crop", verifyJwt, authorizeRoles("admin", "expert"), addCrop);

router.patch(
  "/update-crop/:cropId",
  verifyJwt,
  authorizeRoles("admin", "expert"),
  updateCrop
);

router.delete(
  "/delete-crop/:cropId",
  verifyJwt,
  authorizeRoles("admin", "expert"),
  deleteCrop
);

router.get("/get-crops", verifyJwt, getCrops);

router.get("/get-crop/:cropId", verifyJwt, getCrop);

export default router;
