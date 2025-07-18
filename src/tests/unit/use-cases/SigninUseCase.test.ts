import { User } from "@/data/entities/User";
import { IUserRepository } from "@/data/repositories/type";
import AuthenticationError from "@/errors/AuthenticationError";
import { ISigninCommand, SigninUseCase } from "@/use-cases/SigninUseCase";
import { comparePassword } from "@/utils/hashUtils";
import { plainToInstance } from "class-transformer";

jest.mock("@/utils/hashUtils");
const mockComparePassword = comparePassword as jest.Mock;

describe("SigninUseCase", () => {
  let signinUseCase: SigninUseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeAll(() => {
    mockRepository = {
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      updateUser: jest.fn(),
    };

    signinUseCase = new SigninUseCase(mockRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const command: ISigninCommand = {
    email: "test@example.com",
    password: "password123",
  };

  const userData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword",
    phone: "+1234567890",
    address: "123 Main St",
    imageUrl: "http://example.com/image.png",
    jobTitle: "Tester",
    bio: "I am a test user.",
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should return a user DTO on successful sign-in", async () => {
    mockRepository.findUserByEmail.mockResolvedValue(userData);
    mockComparePassword.mockResolvedValue(true);

    const user = plainToInstance(User, userData);
    const expectedDto = user.asDto();

    const result = await signinUseCase.execute(command);

    expect(result).toEqual(expectedDto);
    expect(mockRepository.findUserByEmail).toHaveBeenCalledWith(command.email);
    expect(mockComparePassword).toHaveBeenCalledWith(command.password, userData.password);
  });

  it("should throw AuthenticationError if user is not found", async () => {
    mockRepository.findUserByEmail.mockResolvedValue(null);

    await expect(signinUseCase.execute(command)).rejects.toThrow(AuthenticationError);
    await expect(signinUseCase.execute(command)).rejects.toMatchObject({
      message: "Invalid credentials",
      statusCode: 401,
    });
  });

  it("should throw AuthenticationError if email is not verified", async () => {
    const unverifiedUser = { ...userData, isEmailVerified: false };
    mockRepository.findUserByEmail.mockResolvedValue(unverifiedUser);

    await expect(signinUseCase.execute(command)).rejects.toThrow(AuthenticationError);
    await expect(signinUseCase.execute(command)).rejects.toMatchObject({
      message: "Email not verified",
      statusCode: 400,
    });
  });

  it("should throw AuthenticationError if password is not valid", async () => {
    mockRepository.findUserByEmail.mockResolvedValue(userData);
    mockComparePassword.mockResolvedValue(false);

    await expect(signinUseCase.execute(command)).rejects.toThrow(AuthenticationError);
    await expect(signinUseCase.execute(command)).rejects.toMatchObject({
      message: "Invalid credentials",
      statusCode: 401,
    });
  });
});
