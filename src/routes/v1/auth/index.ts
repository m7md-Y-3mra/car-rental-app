import { Router, Request, Response } from "express";
import * as authValidator from "@/middleware/validators/authValidator";
import * as authController from "./controller";

const authRouter = Router();

authRouter.post(
  "/signup",
  authValidator.signupValidator,
  authValidator.handleValidationErrors,
  authController.signup,
);

authRouter.get(
  "/verify-email",
  authValidator.validateVerifyEmail,
  authValidator.handleValidationErrors,
  authController.verifyEmail,
);

authRouter.post(
  "/resend-verification",
  authValidator.validateResendVerification,
  authValidator.handleValidationErrors,
  authController.resendVerificationEmail,
);

export default authRouter;
