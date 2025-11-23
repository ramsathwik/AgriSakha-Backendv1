import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errorMessages = result.array().map((err) => err.msg);

    return next(new ApiError(400, "Validation failed", errorMessages));
  }

  next();
};

export { validate };
