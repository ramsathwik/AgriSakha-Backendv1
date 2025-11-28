import express from "express";
const router = express.Router();
import {
  addEmergencyContact,
  updateEmergenctContact,
  deleteEmergencyContact,
  getEmergencyContacts,
  getAllEmergencyContacts,
} from "../controllers/emergencyContact.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

router.post(
  "/add-contact",
  verifyJwt,
  authorizeRoles("admin"),
  addEmergencyContact
);

router.patch(
  "/update-contact/:contactId",
  verifyJwt,
  authorizeRoles("admin"),
  updateEmergenctContact
);

router.delete(
  "/delete-contact/:contactId",
  verifyJwt,
  authorizeRoles("admin"),
  deleteEmergencyContact
);

router.get("/get-contacts", verifyJwt, getEmergencyContacts);

router.get(
  "/get-all-contacts",
  verifyJwt,
  authorizeRoles("admin"),
  getAllEmergencyContacts
);

export default router;
