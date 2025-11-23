import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/tipCategory.controller.js";

const router = express.Router();

router.post(
  "/add-category",
  verifyJwt,
  authorizeRoles("admin", "expert"),
  addCategory
);
router.get("/get-categories", verifyJwt, getCategories);

router.patch(
  "/update-category",
  verifyJwt,
  authorizeRoles("admin"),
  updateCategory
);
router.delete(
  "/delete-category",
  verifyJwt,
  authorizeRoles("admin"),
  deleteCategory
);

export default router;
