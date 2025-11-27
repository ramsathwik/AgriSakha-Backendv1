import express from "express";
const router = express.Router();
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  AddTip,
  getTips,
  getTip,
  updateTip,
  deleteTip,
  getTipsByCategory,
  ToggleSaveTip,
} from "../controllers/tip.controller.js";

router.post(
  "/add-tip",
  verifyJwt,
  authorizeRoles("admin", "expert"),
  upload.single("tipImage"),
  AddTip
);
router.get("/get-tips", verifyJwt, getTips);
router.get("/get-tip/:tipId", verifyJwt, getTip);
router.get("/category/:categoryId", verifyJwt, getTipsByCategory);
router.patch(
  "/update-tip/:tipId",
  verifyJwt,
  authorizeRoles("admin", "expert"),
  upload.single("tipImage"),
  updateTip
);
router.delete(
  "/delete-tip/:tipId",
  verifyJwt,
  authorizeRoles("admin", "expert"),
  deleteTip
);

router.post("/save-tip/:tipId", verifyJwt, ToggleSaveTip);

export default router;
