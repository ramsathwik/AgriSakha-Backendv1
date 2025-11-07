import mongoose from "mongoose";

const emergencyContactsSchema = mongoose.Schema(
  {
    officerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    serviceAreaLevel: {
      type: String,
      required: true,
    },
    specializations: [{ type: String, required: true }],
    isActive: {
      type: Boolean,
      default: true,
    },
    state: {
      type: mongoose.Types.ObjectId,
      ref: "State",
      required: true,
    },
    district: {
      type: mongoose.Types.ObjectId,
      ref: "District",
      required: true,
    },
    mandal: {
      type: mongoose.Types.ObjectId,
      ref: "Mandal",
    },
    village: {
      type: mongoose.Types.ObjectId,
      ref: "Village",
    },
  },
  { timestamps: true }
);

export const EmergencyContact = mongoose.model(
  "EmergencyContact",
  emergencyContactsSchema
);
