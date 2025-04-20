import { promises as fsPromises } from "fs";
import path from "path";

import asyncHandler from "express-async-handler";
import streamifier from "streamifier";
import sharp from "sharp";

import ApiError from "../Utils/ApiError.js";
import USER from "../Models/user.model.js";
import cloudinary from "../Config/cloudinary.js";
import { uploadSingle } from "../Middleware/upload-image.middleware.js";
import { log } from "console";

export const profileImage = uploadSingle([
  { name: "profileImage", maxCount: 1 },
]);

export const uploadFileToCloudinary = asyncHandler(async (req, res, next) => {
  if (req.files) {
    // cheal if old image exist
    const oldImageId = req.user.profileImage;
    console.log("oldImageId", oldImageId);
    if (oldImageId) {
      const deleteOldImage = await cloudinary.uploader.destroy(oldImageId);
      if (deleteOldImage.result !== "ok") {
        return next(
          new ApiError("Failed to delete old image from Cloudinary", 500)
        );
      }
    }
    // Resize the image before uploading to Cloudinary
    const resizedBuffer = await sharp(req.files.profileImage[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload the image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "users", // اختياري
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(resizedBuffer).pipe(stream);
    });
    req.body.profileImage = result.public_id;
    req.body.profileImageUrl = result.secure_url;
  }
  next();
});

export const update_user = asyncHandler(async (req, res, next) => {
  const user = await USER.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      profileImage: req.body.profileImage,
      profileImageUrl: req.body.profileImageUrl,
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  res.json({ message: "Profile updated", user });
});

// @desc  Get all users except userId
// @route GET /api/v1/users
// @access Private
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await USER.find({ _id: { $ne: req.user._id } }).select(
    "-password -__v"
  );
  if (!users) {
    return next(new ApiError("No users found", 404));
  }
  res.json({ message: "All users", users });
});
