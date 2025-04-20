import { check } from "express-validator";
import validatorMiddelwere from "../../Middleware/validators.Middlewere.js";
import USER from "../../Models/user.model.js";
import ApiError from "../ApiError.js";

export const signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      return USER.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
        return true;
      });
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("profileImage")
    .optional()
    .isURL()
    .withMessage("Invalid URL format for profile image"),
  validatorMiddelwere,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password").notEmpty().withMessage("Password is required"),
  validatorMiddelwere,
];
