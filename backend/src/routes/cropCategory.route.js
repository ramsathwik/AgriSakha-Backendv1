import express from "express";
const router = express.Router();
import {
  addCropCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from "../controllers/cropCategory.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

router.post(
  "/add-category",
  verifyJwt,
  authorizeRoles("admin", "expert"),
  addCropCategory
);
router.patch(
  "/update-category/:categoryId",
  verifyJwt,
  authorizeRoles("admin", "expert"),
  updateCategory
);
router.delete(
  "/delete-category/:categoryId",
  verifyJwt,
  authorizeRoles("admin", "expert"),
  deleteCategory
);
router.get("/get-categories", verifyJwt, getCategories);

export default router;
