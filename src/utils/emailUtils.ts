import { BASE_URL } from "@/config/env";
import { IMailer, IMailNotification } from "@/services/mailer/interface";
import { User } from "@prisma/client";
import { EmailTemplate } from "./emailTemplate";

const createVerificationEmailNotification = (user: User, token: string): IMailNotification => {
  const verificationLink = `${BASE_URL}/api/auth/verify-email?token=${token}`;
  const html = EmailTemplate({
    name: user.name,
    link: verificationLink,
    description:
      "Thank you for signing up! To complete your registration, please click the button below to verify your email address.",
    buttonLabel: "Verify Email",
  });
  const subject = "Verify Your Email Address";
  const text = `Hello ${user.name},\n\nPlease verify your email by clicking the link: ${verificationLink}`;

  if (!user.email) {
    throw new Error("User email is not defined");
  }
  return {
    to: user.email,
    subject,
    text,
    html,
  };
};

export const sendVerificationEmail = async (
  mailer: IMailer,
  user: User,
  token: string,
): Promise<void> => {
  const notification = createVerificationEmailNotification(user, token);
  await mailer.send(notification);
};
