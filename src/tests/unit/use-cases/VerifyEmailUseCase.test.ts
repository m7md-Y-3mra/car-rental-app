import { IUserRepository } from "@/data/repositories/type";
import EmailVerifiedError from "@/errors/EmailVerifiedError";
import EntityNotFoundError from "@/errors/EntityNotFoundError";
import InvalidTokenError from "@/errors/InvalidTokenError";
import { IMailer } from "@/services/mailer/interface";
import { VerifyEmailUseCase } from "@/use-cases/VerifyEmailUseCase";
import { verifyToken } from "@/utils/jwtUtils";

jest.mock("@/utils/jwtUtils");

describe("VerifyEmailUseCase", () => {
  let useCase: VerifyEmailUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockMailer: jest.Mocked<IMailer>;

  beforeEach(() => {
    mockUserRepository = {
      findUserById: jest.fn(),
      updateUser: jest.fn(),
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    mockMailer = {
      send: jest.fn(),
    };

    useCase = new VerifyEmailUseCase(mockUserRepository, mockMailer);
    jest.clearAllMocks();
  });

  const mockCommand = {
    token: "valid-token",
  };

  const mockUser = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    isEmailVerified: false,
    password: "hashedPassword",
    phone: "+1234567890",
    address: "123 Test St",
    imageUrl: null,
    jobTitle: null,
    bio: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("Token Verification", () => {
    it("should handle empty token", async () => {
      const emptyTokenCommand = { token: "" };

      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new InvalidTokenError({
          message: "Token is required",
          statusCode: 400,
          code: "ERR_TOKEN_REQUIRED",
        });
      });

      await expect(useCase.execute(emptyTokenCommand)).rejects.toMatchObject(
        new InvalidTokenError({
          message: "Token is required",
          statusCode: 400,
          code: "ERR_TOKEN_REQUIRED",
        }),
      );

      expect(mockUserRepository.findUserById).not.toHaveBeenCalled();
      expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    });

    it("should handle expired token", async () => {
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new InvalidTokenError({
          message: "Token has expired",
          statusCode: 401,
          code: "ERR_TOKEN_EXPIRED",
        });
      });

      await expect(useCase.execute(mockCommand)).rejects.toThrow(
        new InvalidTokenError({
          message: "Token has expired",
          statusCode: 401,
          code: "ERR_TOKEN_EXPIRED",
        }),
      );
    });

    it("should handle malformed token", async () => {
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new InvalidTokenError({
          message: "Invalid token format",
          statusCode: 400,
          code: "ERR_INVALID_TOKEN",
        });
      });

      await expect(useCase.execute(mockCommand)).rejects.toThrow(
        new InvalidTokenError({
          message: "Invalid token format",
          statusCode: 400,
          code: "ERR_INVALID_TOKEN",
        }),
      );
    });

    it("should handle token with invalid payload structure", async () => {
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new InvalidTokenError({
          message: "Token payload is invalid",
          statusCode: 400,
          code: "ERR_INVALID_PAYLOAD",
        });
      });

      await expect(useCase.execute(mockCommand)).rejects.toThrow(
        new InvalidTokenError({
          message: "Token payload is invalid",
          statusCode: 400,
          code: "ERR_INVALID_PAYLOAD",
        }),
      );
    });
  });

  describe("Email Verification", () => {
    it("should verify email successfully", async () => {
      (verifyToken as jest.Mock).mockReturnValue({ id: 1 });
      mockUserRepository.findUserById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue({
        ...mockUser,
        isEmailVerified: true,
      });

      await useCase.execute(mockCommand);

      expect(verifyToken).toHaveBeenCalledWith(mockCommand.token);
      expect(mockUserRepository.findUserById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(1, {
        isEmailVerified: true,
      });
    });

    it("should throw EmailVerifiedError if email is already verified", async () => {
      const verifiedUser = { ...mockUser, isEmailVerified: true };
      (verifyToken as jest.Mock).mockReturnValue({ id: 1 });
      mockUserRepository.findUserById.mockResolvedValue(verifiedUser);

      await expect(useCase.execute(mockCommand)).rejects.toThrow(
        new EmailVerifiedError({
          message: "Email already verified",
          statusCode: 400,
          code: "ERR_EV",
        }),
      );
    });

    it("should throw EntityNotFoundError if user not found", async () => {
      (verifyToken as jest.Mock).mockReturnValue({ id: 999 });
      mockUserRepository.findUserById.mockRejectedValue(
        new EntityNotFoundError({
          message: "User not found",
          statusCode: 404,
        }),
      );

      await expect(useCase.execute(mockCommand)).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("Error Handling", () => {
    it("should handle database update error", async () => {
      (verifyToken as jest.Mock).mockReturnValue({ id: 1 });
      mockUserRepository.findUserById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockRejectedValue(new Error("Database error"));

      await expect(useCase.execute(mockCommand)).rejects.toThrow("Database error");
    });
  });
});
