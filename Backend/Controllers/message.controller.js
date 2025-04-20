import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";

import ApiError from "../Utils/ApiError.js";
import MESSAGE from "../Models/message.model.js";
import { getReceiverSocketId, io } from "../Utils/socket.io.js";

//@desc  Get all messageses between two users
//@route  GET /api/v1/messages/:userId
//@access  Private

export const getMessagr = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const messages = await MESSAGE.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  })
    .populate("sender", "name profileImage")
    .populate("receiver", "name profileImage")
    .sort({ createdAt: -1 });

  if (!messages) {
    return next(new ApiError("No messages found", 404));
  }

  res.json({ message: "All messages", messages });
});

//@desc  Create a new message
//@route  POST /api/v1/messages/:Id
//@access  Private
export const createMessage = asyncHandler(async (req, res, next) => {
  const { text, image } = req.body;
  const receiver = req.params.Id;

  if (!text || !receiver) {
    return next(new ApiError("Please provide all fields", 400));
  }

  const imageresponse = await cloudinary.v2.uploader.upload(image, {
    folder: "messages",
  });

  const newMessage = await MESSAGE.create({
    text,
    sender: req.user._id,
    receiver,
    image: imageresponse.secure_url,
  });

  const receiverSocketId = getReceiverSocketId(receiver);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", {
      sender: req.user._id,
      text,
      image: imageresponse.secure_url,
    });
  }

  res.status(201).json({ message: "Message sent", newMessage });
});

//@desc  Delete a message
//@route  DELETE /api/v1/messages/:id
//@access  Private
