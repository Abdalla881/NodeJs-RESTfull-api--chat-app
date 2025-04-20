import express from "express";
const router = express.Router();

import {
  signup,
  login,
  logout,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  checkAuth,
} from "../Controllers/auth.controller.js";
import {
  signupValidator,
  loginValidator,
} from "../Utils/validators/auth.Validation.js";
import { protect } from "../Middleware/auth.middlewere.js";

router.post("/signup", signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/verifyresetcode", verifyResetCode);
router.get("/check", protect, checkAuth);

router.put("/resetpassword", resetPassword);

export default router;
