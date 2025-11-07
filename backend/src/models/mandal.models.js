import mongoose from "mongoose";

const mandalSchema = mongoose.Schema({
  mandal: {
    type: String,
    required: true,
  },
  district: {
    type: mongoose.Types.ObjectId,
    ref: "District",
  },
});

export const Mandal = mongoose.model("Mandal", mandalSchema);
