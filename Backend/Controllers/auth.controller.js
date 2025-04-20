import crypto from "node:crypto";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import asyncHandler from "express-async-handler";
import USER from "../Models/user.model.js";
import ApiError from "../Utils/ApiError.js";
import { transporter } from "../Utils/send-email.js";

// @desc    generate JWT token
const generateToken = (payload, res) => {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ _id: payload }, secret, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return token;
};

// @desc    Signup user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res, next) => {
  const user = await USER.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  if (!user) {
    return next(new ApiError("User not created", 400));
  }
  console.log(user);

  const token = generateToken(user._id, res);
  res.status(201).json({
    status: "success",
    user,
    token,
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await USER.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    // Check if user exists and password is correct
    return next(new ApiError("Invalid email or password", 401));
  }

  const token = generateToken(user._id, res);
  res.status(200).json({
    status: "success",
    user,
    token,
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res, next) => {
  // Clear the cookie
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    status: "success",
    message: "user logged out",
  });
});

// @desc forgot password
// @route POST /api/v1/auth/forgotpassword
// @access Public

export const forgotPassword = asyncHandler(async (req, res, next) => {
  // get user by email ,check if user exists
  const user = await USER.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  // genrate resetcode and send email and save in database
  const ResetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  const secret = "abcdefg";
  const resetCodeHash = crypto
    .createHmac("sha256", secret)
    .update(ResetCode)
    .digest("hex");

  user.resetCode = resetCodeHash;
  user.resetCodeExpired = resetCodeExpire;
  await user.save();

  // send email
  const message = `Your reset code is ${ResetCode}. It is valid for 10 minutes.`;
  const mailOptions = {
    from: "chat-app",
    to: user.email,
    subject: "Password Reset Code",
    text: message,
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      user.resetCode = undefined;
      user.resetCodeExpired = undefined;
      user.save();
      return next(new ApiError("Error sending email", 500));
    }
    res.status(200).json({
      status: "success",
      message: "Reset code sent to email",
    });
  });
});

// @desc verify reset code
// @route POST /api/v1/auth/verifyresetcode
// @access Public
export const verifyResetCode = asyncHandler(async (req, res, next) => {
  const secret = "abcdefg";
  const resetCodeHash = crypto
    .createHmac("sha256", secret)
    .update(req.body.resetCode)
    .digest("hex");

  const user = await USER.findOne({
    resetCode: resetCodeHash,
    resetCodeExpired: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }
  // reset code is valid
  user.isverified = true;

  await user.save();
  res.status(200).json({
    status: "success",
    message: "Reset code is valid",
  });
});

// @desc reset password
// @route Put /api/v1/auth/resetpassword
// @access Public

export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await USER.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  // check if reset code is valid
  if (!user.isverified) {
    return next(new ApiError("Reset code is not verified", 400));
  }

  user.password = req.body.password;
  user.passwordChangedAt = Date.now();
  user.changePassword = true;

  user.resetCode = undefined;
  user.resetCodeExpired = undefined;
  user.isverified = false;

  //send email after password reset
  const message = `Your password has been reset successfully.`;
  const mailOptions = {
    from: "chat-app",
    to: user.email,
    subject: "Password Reset Successfully",
    text: message,
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(new ApiError("Error sending email", 500));
    }
  });

  await user.save();
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
