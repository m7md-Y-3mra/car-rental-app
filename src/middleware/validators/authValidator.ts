import { body, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import repository from "@/data/repositories";

const emailExists = async (email: string) => {
  const user = await repository.findUserByEmail(email);
  if (user) throw new Error("Email already in use");
  return true;
};

const emailNotExists = async (email: string) => {
  const user = await repository.findUserByEmail(email);
  if (!user) {
    throw new Error("Email not found");
  }
  return true;
};

export const signupValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 character"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(emailExists),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a symbol",
    ),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone("ar-PS")
    .withMessage("invalid phone number"),

  body("address").notEmpty().withMessage("Address is required").isString(),
];

export const validateVerifyEmail = [
  query("token").notEmpty().withMessage("Verification token is required").isString(),
];

export const validateResendVerification = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(emailNotExists),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(
      errors.array().map((err) => ({
        msg: err.msg,
      })),
    );
    return;
  }
  next();
};
