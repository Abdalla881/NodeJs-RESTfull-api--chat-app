import express from "express";
const router = express.Router();

import { protect, AllowTo } from "../Middleware/auth.middlewere.js";
import {
  update_user,
  profileImage,
  uploadFileToCloudinary,
  getAllUsers,
} from "../Controllers/User.Controller.js";
router.put(
  "/",
  protect,
  AllowTo("user"),
  profileImage,
  uploadFileToCloudinary,
  update_user
);

router.get("/", protect, AllowTo("user"), getAllUsers);

export default router;
