import mongoose from "mongoose";

const villageSchema = mongoose.Schema({
  village: {
    type: String,
    required: true,
  },
  mandal: {
    type: mongoose.Types.ObjectId,
    ref: "Mandal",
  },
});

export const Village = mongoose.model("Village", villageSchema);
