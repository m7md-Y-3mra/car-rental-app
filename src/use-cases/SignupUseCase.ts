import { User } from "@/data/entities/User";
import { IUserRepository } from "@/data/repositories/type";
import { IMailer } from "@/services/mailer/interface";
import { sendVerificationEmail } from "@/utils/emailUtils";
import { hashPassword } from "@/utils/hashUtils";
import { generateToken } from "@/utils/jwtUtils";
import { plainToInstance } from "class-transformer";

export interface ISignupUseCase {
  execute(command: SignupCommand): Promise<UserDTO>;
}

export interface SignupCommand {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export class SignupUseCase implements ISignupUseCase {
  constructor(
    protected repository: IUserRepository,
    protected mailer: IMailer,
  ) {}

  async execute(command: SignupCommand) {
    const hashedPassword = await hashPassword(command.password);

    const userData = await this.repository.createUser({
      ...command,
      password: hashedPassword,
      isEmailVerified: false,
    });

    const verificationToken = generateToken({ id: userData.id });

    await sendVerificationEmail(this.mailer, userData, verificationToken).catch((err) =>
      console.log(err),
    );

    const user = plainToInstance(User, userData);
    return user.asDto();
  }
}
