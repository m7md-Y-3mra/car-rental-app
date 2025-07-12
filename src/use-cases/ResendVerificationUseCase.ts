import { User } from "@/data/entities/User";
import { IUserRepository } from "@/data/repositories/type";
import EmailVerifiedError from "@/errors/EmailVerifiedError";
import EntityNotFoundError from "@/errors/EntityNotFoundError";
import { IMailer } from "@/services/mailer/interface";
import { sendVerificationEmail } from "@/utils/emailUtils";
import { generateToken } from "@/utils/jwtUtils";
import { plainToInstance } from "class-transformer";

export interface IResendVerificationUseCase {
  execute(command: IResendVerificationCommand): Promise<UserDTO>;
}

export interface IResendVerificationCommand {
  email: string;
}

export class ResendVerificationUseCase implements IResendVerificationUseCase {
  constructor(
    protected repository: IUserRepository,
    protected mailer: IMailer,
  ) {}

  async execute(command: IResendVerificationCommand) {
    const userData = await this.repository.findUserByEmail(command.email);

    if (!userData) {
      throw new EntityNotFoundError({
        message: "User not found",
        statusCode: 404,
        code: "ERR_NF",
      });
    }

    if (userData.isEmailVerified) {
      throw new EmailVerifiedError({
        message: "Email is already verified",
        statusCode: 400,
        code: "ERR_EV",
      });
    }

    const verificationToken = generateToken({ id: userData.id });

    await sendVerificationEmail(this.mailer, userData, verificationToken);

    const user = plainToInstance(User, userData);

    return user;
  }
}
