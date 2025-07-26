import { Prisma, User } from "@prisma/client";

export interface IUserRepository {
  findUserByEmail: (email: string) => Promise<User | null>;
  createUser: (data: Prisma.UserCreateInput) => Promise<User>;
  findUserById: (id: number) => Promise<User | null>;
  updateUser: (id: number, data: Prisma.UserUpdateInput) => Promise<User>;
  findOrCreateFromSocial: (
    provider: string,
    providerUserId: string,
    name: string,
    email: string | null,
    imageUrl: string | null,
  ) => Promise<User>;
}
