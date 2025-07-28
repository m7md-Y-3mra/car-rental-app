import { User } from "@/data/entities/User";
import { IUserRepository } from "@/data/repositories/type";
import EmailVerifiedError from "@/errors/EmailVerifiedError";
import EntityNotFoundError from "@/errors/EntityNotFoundError";
import { IMailer } from "@/services/mailer/interface";
import { ResendVerificationUseCase } from "@/use-cases/ResendVerificationUseCase";
import { sendVerificationEmail } from "@/utils/emailUtils";
import { generateToken } from "@/utils/jwtUtils";
import { plainToInstance } from "class-transformer";

jest.mock("@/utils/jwtUtils");
jest.mock("@/utils/emailUtils");
jest.mock("class-transformer");

describe("ResendVerificationUseCase", () => {
  let useCase: ResendVerificationUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockMailer: jest.Mocked<IMailer>;

  beforeAll(() => {
    mockUserRepository = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
      findUserById: jest.fn(),
      updateUser: jest.fn(),
      findOrCreateFromSocial: jest.fn(),
    };

    mockMailer = {
      send: jest.fn(),
    };

    useCase = new ResendVerificationUseCase(mockUserRepository, mockMailer);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCommand = {
    email: "test@example.com",
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

  it("should resend verification email successfully", async () => {
    mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
    (generateToken as jest.Mock).mockReturnValue("test-token");
    (sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);
    (plainToInstance as jest.Mock).mockReturnValue({
      asDto: jest.fn(() => mockUser),
    });

    const result = await useCase.execute(mockCommand);

    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(mockCommand.email);
    expect(generateToken).toHaveBeenCalledWith({ id: mockUser.id });
    expect(sendVerificationEmail).toHaveBeenCalledWith(mockMailer, mockUser, "test-token");
    expect(plainToInstance).toHaveBeenCalledWith(User, mockUser);
    expect(result).toEqual(mockUser);
  });

  it("should throw EmailVerifiedError if email is already verified", async () => {
    const verifiedUser = { ...mockUser, isEmailVerified: true };
    mockUserRepository.findUserByEmail.mockResolvedValue(verifiedUser);

    await expect(useCase.execute(mockCommand)).rejects.toThrow(
      new EmailVerifiedError({
        message: "Email is already verified",
        statusCode: 400,
        code: "ERR_EMAIL_ALREADY_VERIFIED",
      }),
    );

    expect(generateToken).not.toHaveBeenCalled();
    expect(sendVerificationEmail).not.toHaveBeenCalled();
    expect(plainToInstance).not.toHaveBeenCalled();
  });

  it("should throw EntityNotFoundError if user does not exist", async () => {
    mockUserRepository.findUserByEmail.mockResolvedValue(null);

    await expect(useCase.execute(mockCommand)).rejects.toThrow(
      new EntityNotFoundError({
        message: "User not found",
        statusCode: 404,
        code: "ERR_NOT_FOUND",
      }),
    );

    expect(generateToken).not.toHaveBeenCalled();
    expect(sendVerificationEmail).not.toHaveBeenCalled();
    expect(plainToInstance).not.toHaveBeenCalled();
  });

  it("should throw error if email sending fails", async () => {
    mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
    (generateToken as jest.Mock).mockReturnValue("test-token");
    (sendVerificationEmail as jest.Mock).mockRejectedValue(new Error("Email error"));

    await expect(useCase.execute(mockCommand)).rejects.toThrow();

    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(mockCommand.email);
    expect(generateToken).toHaveBeenCalledWith({ id: mockUser.id });
    expect(sendVerificationEmail).toHaveBeenCalledWith(mockMailer, mockUser, "test-token");
  });
});
