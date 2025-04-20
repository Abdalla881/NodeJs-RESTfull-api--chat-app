import express from "express";
const router = express.Router();
import {
  getMessagr,
  createMessage,
} from "../Controllers/message.controller.js";
import { protect, AllowTo } from "../Middleware/auth.middlewere.js";

router.get("/:userId", protect, AllowTo("user"), getMessagr);
router.post("/send/:id", protect, createMessage);

export default router;
