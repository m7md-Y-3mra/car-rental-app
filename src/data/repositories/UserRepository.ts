import EntityNotFoundError from "@/errors/EntityNotFoundError";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import BaseRepository, { Constructor } from "./BaseRepository";
import { IUserRepository } from "./type";

export function UserRepository<TBase extends Constructor<BaseRepository>>(Base: TBase) {
  return class extends Base implements IUserRepository {
    async findUserByEmail(email: string) {
      const user = await this.client.user.findUnique({
        where: { email },
      });
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
      return user;
    }

    async updateUser(id: number, data: Prisma.UserUpdateInput) {
      try {
        return await this.client.user.update({
          where: { id },
          data,
        });
      } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
          // Prisma "Record not found" error
          throw new EntityNotFoundError({
            message: "User not found",
            statusCode: 404,
            code: "ERR_NOT_FOUND",
          });
        }
        throw error;
      }
    }
  };
}
