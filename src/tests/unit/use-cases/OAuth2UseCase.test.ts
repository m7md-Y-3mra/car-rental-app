import { plainToInstance } from "class-transformer";
import { User } from "../../../data/entities/User";
import { IUserRepository } from "../../../data/repositories/type";
import { IOAuth2Command, OAuth2UseCase } from "../../../use-cases/OAuth2UseCase";

describe("OAuth2UseCase", () => {
  let oAuth2UseCase: OAuth2UseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeAll(() => {
    mockRepository = {
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      updateUser: jest.fn(),
      findOrCreateFromSocial: jest.fn(),
    };

    oAuth2UseCase = new OAuth2UseCase(mockRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const command: IOAuth2Command = {
    providerName: "google",
    email: "test@example.com",
    displayName: "test",
    id: "1",
    imageUrl: "http://example.com/image.png",
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
    mockRepository.findOrCreateFromSocial.mockResolvedValue(userData);

    const user = plainToInstance(User, userData);
    const expectedDto = user.asDto();

    const result = await oAuth2UseCase.execute(command);

    expect(result).toEqual(expectedDto);
    expect(mockRepository.findOrCreateFromSocial).toHaveBeenCalledWith(
      command.providerName,
      command.id,
      command.displayName,
      command.email,
      command.imageUrl,
    );
  });
});
