import { User } from "@/data/entities/User";
import { IUserRepository } from "@/data/repositories/type";
import { plainToInstance } from "class-transformer";

export interface IOAuth2UseCase {
  execute(command: IOAuth2Command): Promise<UserDTO>;
}

export interface IOAuth2Command {
  id: string;
  displayName: string;
  email: string | null;
  imageUrl: string | null;
}

export class OAuth2UseCase implements IOAuth2UseCase {
  constructor(protected repository: IUserRepository) {}

  async execute(command: IOAuth2Command) {
    const { id, displayName, email, imageUrl } = command;
    const userData = await this.repository.findOrCreateFromSocial(
      "facebook",
      id,
      displayName,
      email,
      imageUrl,
    );
    const user = plainToInstance(User, userData);
    return user.asDto();
  }
}
