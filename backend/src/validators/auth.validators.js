import { body } from "express-validator";
import mongoose from "mongoose";

export const registerUserValidator = () => {
  return [
    // username
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isString()
      .withMessage("Username must be a string"),

    // phone number
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone Number is required")
      .isMobilePhone()
      .withMessage("Invalid phone number"),

    // password
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    // state
    body("state")
      .notEmpty()
      .withMessage("State is required")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid state ID"),

    // district
    body("district")
      .notEmpty()
      .withMessage("District is required")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid district ID"),

    // mandal (optional)
    body("mandal")
      .optional()
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid mandal ID"),

    // village (optional)
    body("village")
      .optional()
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid village ID"),

    // role (optional, but must match enum)
    body("role")
      .optional()
      .isIn(["farmer", "expert", "admin"])
      .withMessage("Invalid role"),
  ];
};

export const loginValidator = () => {
  return [
    body("phoneNumber").notEmpty().withMessage("phoneNumber is required"),
    body("password").notEmpty().withMessage("pasword is required"),
  ];
};
