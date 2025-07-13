import { User } from "@/data/entities/User";

describe("User Entity", () => {
  const validUserData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword123",
    phone: "+1234567890",
    address: "123 Main St",
    imageUrl: "https://example.com/image.jpg",
    jobTitle: "Software Engineer",
    bio: "Test bio",
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should create a valid user", () => {
    const user = new User(
      validUserData.id,
      validUserData.name,
      validUserData.email,
      validUserData.phone,
      validUserData.address,
      validUserData.imageUrl,
      validUserData.jobTitle,
      validUserData.bio,
      validUserData.password,
      validUserData.isEmailVerified,
      validUserData.createdAt,
      validUserData.updatedAt,
    );

    expect(user).toBeDefined();
    expect(user.id).toBe(validUserData.id);
    expect(user.name).toBe(validUserData.name);
    expect(user.email).toBe(validUserData.email);
  });

  it("should exclude sensitive fields when converting to DTO", () => {
    const user = new User(
      validUserData.id,
      validUserData.name,
      validUserData.email,
      validUserData.phone,
      validUserData.address,
      validUserData.imageUrl,
      validUserData.jobTitle,
      validUserData.bio,
      validUserData.password,
      validUserData.isEmailVerified,
      validUserData.createdAt,
      validUserData.updatedAt,
    );

    const userDto = user.asDto();

    expect(userDto).not.toHaveProperty("password");
    expect(userDto).not.toHaveProperty("isEmailVerified");
    expect(userDto).not.toHaveProperty("createdAt");
    expect(userDto).not.toHaveProperty("updatedAt");

    expect(userDto).toHaveProperty("id", validUserData.id);
    expect(userDto).toHaveProperty("name", validUserData.name);
    expect(userDto).toHaveProperty("email", validUserData.email);
    expect(userDto).toHaveProperty("phone", validUserData.phone);
    expect(userDto).toHaveProperty("address", validUserData.address);
    expect(userDto).toHaveProperty("imageUrl", validUserData.imageUrl);
    expect(userDto).toHaveProperty("jobTitle", validUserData.jobTitle);
    expect(userDto).toHaveProperty("bio", validUserData.bio);
  });
});
