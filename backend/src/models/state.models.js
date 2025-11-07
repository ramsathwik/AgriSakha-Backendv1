import mongoose from "mongoose";

const stateSchema = mongoose.Schema({
  state: {
    type: String,
    required: true,
  },
});

export const State = mongoose.model("State", stateSchema);
