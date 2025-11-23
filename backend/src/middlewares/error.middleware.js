import { ApiError } from "../utils/api-error.js";

export const errorHandler = (err, req, res, next) => {
  console.log("from error handler");
  console.log(err);

  // Handle duplicate key errors
  if (err.code === 11000) {
    const message = "Already liked";
    err = new ApiError(400, message);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal server error",
    errors: err.errors || null,
    data: err.data || null,
  });
};
