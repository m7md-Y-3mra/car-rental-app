import repository from "@/data/repositories";
import { mailer } from "@/services/mailer";
import {
  IResendVerificationCommand,
  ResendVerificationUseCase,
} from "@/use-cases/ResendVerificationUseCase";
import { SignupCommand, SignupUseCase } from "@/use-cases/SignupUseCase";
import { VerifyEmailCommand, VerifyEmailUseCase } from "@/use-cases/VerifyEmailUseCase";
import { Request, Response } from "express";

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
