import mongoose from "mongoose";

const emergencyContactsSchema = mongoose.Schema(
  {
    officerName: {
      type: String,
      required: [true, "Officer Name is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "phoneNumber is requierd"],
    },
    designation: {
      type: String,
      required: [true, "designation is required"],
    },
    department: {
      type: String,
      required: [true, "department is required"],
    },
    serviceAreaLevel: {
      type: String,
      required: [true, "Service Level is required"],
    },
    specializations: [
      { type: String, required: [true, "Specialiazations is requied"] },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    state: {
      type: mongoose.Types.ObjectId,
      ref: "State",
      required: [true, "State is required"],
    },
    district: {
      type: mongoose.Types.ObjectId,
      ref: "District",
      required: [true, "Mandal is required"],
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
