import EntityNotFoundError from "@/errors/EntityNotFoundError";
import { OAuthIdentity, Prisma } from "@prisma/client";
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

    findOAuthIdentity = (provider: string, providerUserId: string) => {
      return this.client.oAuthIdentity.findUnique({
        where: {
          provider_providerUserId: {
            provider,
            providerUserId,
          },
        },
        include: {
          user: true,
        },
      });
    };

    createOAuthIdentity = (
      userId: number,
      provider: string,
      providerUserId: string,
    ): Promise<OAuthIdentity> => {
      return this.client.oAuthIdentity.create({
        data: {
          provider,
          providerUserId,
          userId,
        },
      });
    };

    async findOrCreateFromSocial(
      provider: string,
      providerUserId: string,
      name: string,
      email: string | null,
      imageUrl: string | null,
    ) {
      // Check if OAuth identity exists
      const existingIdentity = await this.findOAuthIdentity(provider, providerUserId);

      if (existingIdentity) {
        return existingIdentity.user;
      }

      // Check if user exists by email
      let user = email ? await this.findUserByEmail(email) : null;

      // If user doesn't exist, create a new one
      if (!user) {
        user = await this.client.user.create({
          data: {
            name,
            email,
            imageUrl,
            isEmailVerified: true, // Social accounts are verified
          },
        });
      }

      // Create OAuth identity
      await this.createOAuthIdentity(user.id, provider, providerUserId);

      return user;
    }
  };
}
