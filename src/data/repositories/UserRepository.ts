import EntityNotFoundError from "@/errors/EntityNotFoundError";
import BaseRepository, { Constructor } from "./BaseRepository";
import { IUserRepository } from "./type";
import { Prisma } from "@prisma/client";

export function UserRepository<TBase extends Constructor<BaseRepository>>(Base: TBase) {
  return class extends Base implements IUserRepository {
    async findUserByEmail(email: string) {
      const user = await this.client.user.findUnique({
        where: { email },
      });
      // if (!user) {
      //   throw new EntityNotFoundError({
      //     message: "User not found",
      //     statusCode: 404,
      //     code: "ERR_NF",
      //   });
      // }
      return user;
    }

    createUser(data: Prisma.UserCreateInput) {
      return this.client.user.create({
        data,
      });
    }

    async findUserById(id: number) {
      const user = await this.client.user.findUnique({
        where: { id },
      });
      // if (!user) {
      //   throw new EntityNotFoundError({
      //     message: "User not found",
      //     statusCode: 404,
      //     code: "ERR_NF",
      //   });
      // }
      return user;
    }

    updateUser(id: number, data: Prisma.UserUpdateInput) {
      return this.client.user.update({
        where: { id },
        data,
      });
    }
  };
}
