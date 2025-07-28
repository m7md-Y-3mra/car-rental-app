import passport from "@/config/passport";
import repository from "@/data/repositories";
import AuthenticationError from "@/errors/AuthenticationError";
import { mailer } from "@/services/mailer";
import {
  IResendVerificationCommand,
  ResendVerificationUseCase,
} from "@/use-cases/ResendVerificationUseCase";
import { SignupCommand, SignupUseCase } from "@/use-cases/SignupUseCase";
import { VerifyEmailCommand, VerifyEmailUseCase } from "@/use-cases/VerifyEmailUseCase";
import { NextFunction, Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  const command: SignupCommand = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
  };

  const signupUseCase = new SignupUseCase(repository, mailer);

  const user = await signupUseCase.execute(command);

  res.status(201).send({ user: user });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const command: VerifyEmailCommand = {
    token: typeof req.query.token === "string" ? req.query.token : "",
  };

  const verifyEmailUseCase = new VerifyEmailUseCase(repository);

  await verifyEmailUseCase.execute(command);

  res.status(200).send({ message: "Email verified successfully" });
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const command: IResendVerificationCommand = {
    email: req.body.email,
  };

  const resendVerificationUseCase = new ResendVerificationUseCase(repository, mailer);

  await resendVerificationUseCase.execute(command);

  res.status(200).send({
    message: "Verification email resent successfully",
  });
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: unknown, user: UserDTO) => {
    if (err) {
      next(err);
      return;
    }

    // Log in user
    req.logIn(user, (err) => {
      if (err) {
        next(err);
        return;
      }

      return res.send({
        user,
      });
    });
  })(req, res, next);
};

export const oauthCallback = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(
      new AuthenticationError({
        message: "Authentication failed",
        statusCode: 401,
        code: "ERR_AUTH",
      }),
    );
  }

  req.logIn(req.user as UserDTO, (err) => {
    if (err) {
      return next(err);
    }

    return res.json({ user: req.user });
  });
};
