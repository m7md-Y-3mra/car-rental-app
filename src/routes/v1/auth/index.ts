import * as authValidator from "@/middleware/validators/authValidator";
import { Router } from "express";
import passport from "passport";
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

authRouter.get("/google", passport.authenticate("google"));
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  authController.oauthCallback,
);

authRouter.get("/facebook", passport.authenticate("facebook"));
authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/signin" }),
  authController.oauthCallback,
);

export default authRouter;
