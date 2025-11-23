import { ApiError } from "../utils/api-error.js";
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      throw new ApiError(401, "unAuthorized:role missing");
    }
    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, "Access Denied:insufficient permissions");
    }
    next();
  };
};
