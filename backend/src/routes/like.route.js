import express from "express";
const router = express.Router();
import { toggleLikeTip } from "../controllers/like.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.post("/toggle-like/:tipId", verifyJwt, toggleLikeTip);

export default router;
