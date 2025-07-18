import * as authValidator from "@/middleware/validators/authValidator";
import { Router } from "express";
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

authRouter.post(
  "/signin",
  authValidator.signinValidator,
  authValidator.handleValidationErrors,
  authController.signin,
);

export default authRouter;
