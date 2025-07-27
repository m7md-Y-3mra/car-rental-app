import BaseRepository from "@/data/repositories/BaseRepository";
import { UserRepository } from "@/data/repositories/UserRepository";
import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";

const prismaMock = mockDeep<PrismaClient>();

class DummyRepository extends BaseRepository {
  constructor() {
    super();
    this.client = prismaMock as unknown as PrismaClient;
  }
}

const UserRepositoryWithMock = UserRepository(DummyRepository);
const userRepository = new UserRepositoryWithMock();

describe("UserRepository", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe("findOrCreateFromSocial", () => {
    const provider = "google";
    const providerUserId = "12345";
    const name = "Test User";
    const email = "test@example.com";
    const imageUrl = "http://example.com/image.jpg";

    beforeEach(() => {
      (prismaMock.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(prismaMock);
      });
    });

    it("should return an existing user if the OAuth identity already exists", async () => {
      const user = {
        id: 1,
        name,
        email,
        password: null,
        imageUrl,
        isEmailVerified: true,
        phone: null,
        address: null,
        jobTitle: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const oauthIdentity = {
        id: 1,
        provider,
        providerUserId,
        userId: user.id,
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.oAuthIdentity.findUnique.mockResolvedValue(oauthIdentity);

      const result = await userRepository.findOrCreateFromSocial(
        provider,
        providerUserId,
        name,
        email,
        imageUrl,
      );

      expect(result).toEqual(user);
      expect(prismaMock.oAuthIdentity.findUnique).toHaveBeenCalledWith({
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
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.user.create).not.toHaveBeenCalled();
      expect(prismaMock.oAuthIdentity.create).not.toHaveBeenCalled();
    });

    it("should return an existing user if a user with the same email exists, and create a new OAuth identity for them", async () => {
      const user = {
        id: 1,
        name,
        email,
        password: null,
        imageUrl,
        isEmailVerified: true,
        phone: null,
        address: null,
        jobTitle: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.oAuthIdentity.findUnique.mockResolvedValue(null);
      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await userRepository.findOrCreateFromSocial(
        provider,
        providerUserId,
        name,
        email,
        imageUrl,
      );

      expect(result).toEqual(user);
      expect(prismaMock.oAuthIdentity.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(prismaMock.user.create).not.toHaveBeenCalled();
      expect(prismaMock.oAuthIdentity.create).toHaveBeenCalledWith({
        data: {
          provider,
          providerUserId,
          userId: user.id,
        },
      });
    });

    it("should create a new user and a new OAuth identity if no user or OAuth identity exists", async () => {
      const newUser = {
        id: 2,
        name,
        email,
        password: null,
        imageUrl,
        isEmailVerified: true,
        phone: null,
        address: null,
        jobTitle: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.oAuthIdentity.findUnique.mockResolvedValue(null);
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(newUser);

      const result = await userRepository.findOrCreateFromSocial(
        provider,
        providerUserId,
        name,
        email,
        imageUrl,
      );

      expect(result).toEqual(newUser);
      expect(prismaMock.oAuthIdentity.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          name,
          email,
          imageUrl,
          isEmailVerified: true,
        },
      });
      expect(prismaMock.oAuthIdentity.create).toHaveBeenCalledWith({
        data: {
          provider,
          providerUserId,
          userId: newUser.id,
        },
      });
    });

    it("should handle cases where the email is null", async () => {
      const newUser = {
        id: 3,
        name,
        email: null,
        password: null,
        imageUrl,
        isEmailVerified: true,
        phone: null,
        address: null,
        jobTitle: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.oAuthIdentity.findUnique.mockResolvedValue(null);
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(newUser);

      const result = await userRepository.findOrCreateFromSocial(
        provider,
        providerUserId,
        name,
        null,
        imageUrl,
      );

      expect(result).toEqual(newUser);
      expect(prismaMock.oAuthIdentity.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          name,
          email: null,
          imageUrl,
          isEmailVerified: true,
        },
      });
      expect(prismaMock.oAuthIdentity.create).toHaveBeenCalledWith({
        data: {
          provider,
          providerUserId,
          userId: newUser.id,
        },
      });
    });
  });
});
