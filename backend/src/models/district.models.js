import mongoose from "mongoose";

const districtSchema = mongoose.Schema({
  district: {
    type: String,
    required: true,
  },
  state: {
    type: mongoose.Types.ObjectId,
    ref: "State",
  },
});

export const District = mongoose.model("District", districtSchema);
