import jwt from "jsonwebtoken";
import asyncHsndler from "express-async-handler";

import USER from "../Models/user.model.js";
import ApiError from "../Utils/ApiError.js";

// @desc    protect routes
export const protect = asyncHsndler(async (req, res, next) => {
  // check if token exists
  let token = req.cookies.token;
  if (!token) {
    return next(new ApiError("Not authorized to access this route", 401));
  }
  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // check if user exists
  const user = await USER.findById(decoded._id);
  if (!user) {
    return next(new ApiError("User no longer exists", 401));
  }
  // check if user changed password
  if (user.changePassword) {
    const convertedTime = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (convertedTime > decoded.iat) {
      return next(new ApiError("User recently changed password", 401));
    }
  }
  req.user = user;
  next();
});

// @desc    restrict to specific roles
export const AllowTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
