import { IUserRepository } from "@/data/repositories/type";
import { IMailer } from "@/services/mailer/interface";
import { SignupUseCase } from "@/use-cases/SignupUseCase";
import { sendVerificationEmail } from "@/utils/emailUtils";
import { hashPassword } from "@/utils/hashUtils";
import { generateToken } from "@/utils/jwtUtils";
import { plainToInstance } from "class-transformer";

jest.mock("@/utils/hashUtils");
jest.mock("@/utils/jwtUtils");
jest.mock("@/utils/emailUtils");
jest.mock("class-transformer");

describe("SignupUseCase", () => {
  let mockRepository: jest.Mocked<IUserRepository>;
  let mockMailer: jest.Mocked<IMailer>;
  let useCase: SignupUseCase;

  beforeEach(() => {
    mockRepository = {
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      updateUser: jest.fn(),
    };

    mockMailer = {
      send: jest.fn(),
    };

    useCase = new SignupUseCase(mockRepository, mockMailer);
  });

  const validCommand = {
    name: "John Doe",
    email: "john@example.com",
    password: "Password123!",
    phone: "+1234567890",
    address: "123 Main St",
  };

  it("should create a new user and send verification email", async () => {
    const createdUser = {
      id: 1,
      ...validCommand,
      isEmailVerified: false,
      imageUrl: null,
      jobTitle: null,
      bio: null,
      createdAt: new Date("2025-07-10T08:15:29.500Z"),
      updatedAt: new Date("2025-07-10T08:15:29.500Z"),
    };

    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
    mockRepository.createUser.mockResolvedValue(createdUser);
    (generateToken as jest.Mock).mockReturnValue("token");
    (sendVerificationEmail as jest.Mock).mockResolvedValue(null);
    (plainToInstance as jest.Mock).mockReturnValue({
      asDto: jest.fn(() => ({})),
    });

    const result = await useCase.execute(validCommand);

    expect(hashPassword).toHaveBeenCalledWith(validCommand.password);
    expect(mockRepository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        ...validCommand,
        isEmailVerified: false,
        password: "hashedPassword",
      }),
    );
    expect(sendVerificationEmail).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalledWith(mockMailer, createdUser, "token");
    expect(result).toBeDefined();
    expect(result).toEqual({});
  });

  it("should still create user if email sending fails", async () => {
    const createdUser = {
      id: 1,
      ...validCommand,
      isEmailVerified: false,
      imageUrl: null,
      jobTitle: null,
      bio: null,
      createdAt: new Date("2025-07-10T08:15:29.500Z"),
      updatedAt: new Date("2025-07-10T08:15:29.500Z"),
    };

    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
    mockRepository.createUser.mockResolvedValue(createdUser);
    (generateToken as jest.Mock).mockReturnValue("token");
    (sendVerificationEmail as jest.Mock).mockRejectedValue(new Error("Email error"));
    (plainToInstance as jest.Mock).mockReturnValue({
      asDto: jest.fn(() => ({})),
    });

    const result = await useCase.execute(validCommand);

    expect(hashPassword).toHaveBeenCalledWith(validCommand.password);
    expect(mockRepository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        ...validCommand,
        isEmailVerified: false,
        password: "hashedPassword",
      }),
    );
    expect(sendVerificationEmail).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalledWith(mockMailer, createdUser, "token");
    expect(result).toBeDefined();
    expect(result).toEqual({});
  });
});
