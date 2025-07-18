import { User } from "@/data/entities/User";
import { IUserRepository } from "@/data/repositories/type";
import AuthenticationError from "@/errors/AuthenticationError";
import { comparePassword } from "@/utils/hashUtils";
import { plainToInstance } from "class-transformer";

export interface ISigninUseCase {
  execute(command: ISigninCommand): Promise<UserDTO>;
}

export interface ISigninCommand {
  email: string;
  password: string;
}

export class SigninUseCase implements ISigninUseCase {
  constructor(protected repository: IUserRepository) {}

  async execute(command: ISigninCommand) {
    const { email, password } = command;
    const userData = await this.repository.findUserByEmail(email);

    if (!userData) {
      throw new AuthenticationError({
        message: "Invalid credentials",
        statusCode: 401,
        code: "ERR_AUTH",
      });
    }

    if (!userData.isEmailVerified) {
      throw new AuthenticationError({
        message: "Email not verified",
        statusCode: 400,
        code: "ERR_AUTH",
      });
    }

    const validPassword = await comparePassword(password, userData.password);

    if (!validPassword) {
      throw new AuthenticationError({
        message: "Invalid credentials",
        statusCode: 401,
        code: "ERR_AUTH",
      });
    }

    const user = plainToInstance(User, userData);
    return user.asDto();
  }
}
