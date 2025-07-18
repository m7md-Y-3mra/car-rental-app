import repository from "@/data/repositories";
import { createServer } from "@/server";
import * as hashUtils from "@/utils/hashUtils";
import { generateToken } from "@/utils/jwtUtils";
import request from "supertest";

jest.mock("@/data/repositories");
jest.mock("@/utils/hashUtils");
jest.mock("@/services/mailer", () => ({
  mailer: {
    send: jest.fn().mockResolvedValue(undefined),
  },
}));

const app = createServer();

describe("Health endpoint tests", () => {
  test("Health endpoint returns ok 200", async () => {
    await request(app)
      .get("/health")
      .expect(200)
      .then((res) => {
        expect(res.body.ok).toBe(true);
      });
  });
});

describe("AuthController Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /v1/api/auth/signup", () => {
    it("should return 201 and user data on successful signup", async () => {
      const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
      (repository.createUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post("/v1/api/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
        phone: "0591234567",
        address: "123 Test St",
      });

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(mockUser);
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app).post("/v1/api/auth/signup").send({
        email: "invalid-email",
        password: "short",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          code: "ERR_VALIDATION",
          errors: expect.arrayContaining([
            { message: "Name is required" },
            { message: "Name must be at least 2 characters" },
            { message: "Invalid email format" },
            {
              message:
                "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a symbol",
            },
            { message: "Phone is required" },
            { message: "Invalid phone number" },
            // { message: "Address is required" },
            // { message: "Invalid value" },
          ]),
          message: "Validation Error",
        },
      });
    });

    it("should return 400 if email already exists", async () => {
      (repository.findUserByEmail as jest.Mock).mockResolvedValue(true);

      const response = await request(app).post("/v1/api/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "Password123!",
        phone: "0591234567",
        address: "123 Test St",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          code: "ERR_VALIDATION",
          errors: expect.arrayContaining([{ message: "Email already in use" }]),
          message: "Validation Error",
        },
      });
    });
  });

  describe("GET /v1/api/auth/verify-email", () => {
    it("should return 200 on successful email verification", async () => {
      (repository.findUserById as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        isEmailVerified: false,
      });

      const response = await request(app)
        .get("/v1/api/auth/verify-email")
        .query({ token: generateToken({ id: 1 }) });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Email verified successfully" });
    });

    it("should return 400 if token is missing", async () => {
      const response = await request(app).get("/v1/api/auth/verify-email").query({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          code: "ERR_VALIDATION",
          errors: expect.arrayContaining([
            { message: "Verification token is required" },
            { message: "Invalid value" },
          ]),
          message: "Validation Error",
        },
      });
    });

    it("should return 400 if token is invalid", async () => {
      const response = await request(app)
        .get("/v1/api/auth/verify-email")
        .query({ token: "invalid-token" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          message: "Invalid token format",
          code: "ERR_INVALID_TOKEN",
        },
      });
    });
  });

  describe("POST /v1/api/auth/resend-verification", () => {
    it("should return 200 on successful resend", async () => {
      (repository.findUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        isEmailVerified: false,
      });

      const response = await request(app)
        .post("/v1/api/auth/resend-verification")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Verification email resent successfully",
      });
    });

    it("should return 400 if email is missing", async () => {
      const response = await request(app).post("/v1/api/auth/resend-verification").send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          code: "ERR_VALIDATION",
          errors: expect.arrayContaining([
            { message: "Email is required" },
            { message: "Invalid email format" },
          ]),
          message: "Validation Error",
        },
      });
    });

    it("should return 400 if email is not found", async () => {
      (repository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/v1/api/auth/resend-verification")
        .send({ email: "nonexistent@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          code: "ERR_VALIDATION",
          errors: expect.arrayContaining([{ message: "Email not found" }]),
          message: "Validation Error",
        },
      });
    });
  });

  describe("POST /v1/api/auth/signin", () => {
    it("should return 200 and tokens on successful signin", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
        isEmailVerified: true,
      };
      (repository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (hashUtils.comparePassword as jest.Mock).mockResolvedValue(true);

      const response = await request(app).post("/v1/api/auth/signin").send({
        email: "test@example.com",
        password: "Password123!",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          phone: undefined,
          address: undefined,
          imageUrl: undefined,
          jobTitle: undefined,
          bio: undefined,
        },
      });
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app).post("/v1/api/auth/signin").send({
        email: "invalid-email",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          code: "ERR_VALIDATION",
          errors: expect.arrayContaining([
            { message: "Invalid email format" },
            { message: "Password is required" },
          ]),
          message: "Validation Error",
        },
      });
    });

    it("should return 401 for incorrect credentials", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword",
        isEmailVerified: true,
      };
      (repository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (hashUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      const response = await request(app).post("/v1/api/auth/signin").send({
        email: "test@example.com",
        password: "wrongPassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: {
          code: "ERR_AUTH",
          message: "Invalid credentials",
        },
      });
    });
  });
});
