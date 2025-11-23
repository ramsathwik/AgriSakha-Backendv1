import express from "express";
const router = express.Router();

import {
  getStates,
  getDistricts,
  getMandals,
  getVillages,
} from "../controllers/location.controller.js";

router.get("/get-states", getStates);
router.get("/get-districts", getDistricts);
router.get("/get-mandals", getMandals);
router.get("/get-villages", getVillages);

export default router;
