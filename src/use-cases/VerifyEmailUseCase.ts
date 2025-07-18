import { IUserRepository } from "@/data/repositories/type";
import EmailVerifiedError from "@/errors/EmailVerifiedError";
import EntityNotFoundError from "@/errors/EntityNotFoundError";
import { verifyToken } from "@/utils/jwtUtils";

export interface IVerifyEmailUseCase {
  execute(command: VerifyEmailCommand): Promise<void>;
}

export interface VerifyEmailCommand {
  token: string;
}

export class VerifyEmailUseCase implements IVerifyEmailUseCase {
  constructor(protected repository: IUserRepository) {}

  async execute(command: VerifyEmailCommand) {
    const tokenPayload = verifyToken(command.token);

    const userId = Number(tokenPayload.id);
    const user = await this.repository.findUserById(userId);

    if (!user) {
      throw new EntityNotFoundError({
        message: "User not found",
        statusCode: 404,
        code: "ERR_NOT_FOUND",
      });
    }

    if (user.isEmailVerified) {
      throw new EmailVerifiedError({
        message: "Email already verified",
        statusCode: 400,
        code: "ERR_EMAIL_ALREADY_VERIFIED",
      });
    }

    await this.repository.updateUser(userId, { isEmailVerified: true });
  }
}
