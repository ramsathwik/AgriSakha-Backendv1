import { ApiError } from "../utils/api-error.js";
export const errorHandler = (err, req, res, next) => {
  console.log("from error handler");
  console.log(err);

  res
    .status(err.statusCode || 500)
    .json({
      statusCode: err.statusCode,
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
};
