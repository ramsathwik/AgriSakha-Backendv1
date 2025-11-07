import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    farmsize: Number,
    crops: [{ type: mongoose.Types.ObjectId, ref: "Crop" }],
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
    tips: [{ type: mongoose.Types.ObjectId, ref: "Tip" }],
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    refreshToken: String,
    role: {
      type: String,
      enum: ["farmer", "expert", "admin"],
      default: "farmer",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    email: this.email,
    username: this.username,
    role: this.role,
  };
  const mysecret = process.env.ACCESS_TOKEN_SECRET;
  const expires = process.env.ACCESS_TOKEN_EXPIRY;
  return jwt.sign(payload, mysecret, { expiresIn: expires });
};

userSchema.methods.generateRefreshToken = function () {
  const payload = {
    _id: this._id,
  };
  const mysecret = process.env.REFRESH_TOKEN_SECRET;
  const expires = process.env.REFRESH_TOKEN_EXPIRY;
  return jwt.sign(payload, mysecret, { expiresIn: expires });
};

userSchema.methods.generateRandomToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const TokenExpiry = new Date(Date.now() + 20 * 60 * 1000);

  return { unHashedToken, hashedToken, TokenExpiry };
};

const User = mongoose.model("User", userSchema);

export { User };
