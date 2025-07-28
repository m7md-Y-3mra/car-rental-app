import repository from "@/data/repositories";
import AuthenticationError from "@/errors/AuthenticationError";
import {
  oauthCallback,
  resendVerificationEmail,
  signin,
  signup,
  verifyEmail,
} from "@/routes/v1/auth/controller";
import { mailer } from "@/services/mailer";
import { ResendVerificationUseCase } from "@/use-cases/ResendVerificationUseCase";
import { SignupUseCase } from "@/use-cases/SignupUseCase";
import { VerifyEmailUseCase } from "@/use-cases/VerifyEmailUseCase";
import { Request, Response } from "express";
import passport from "passport";

jest.mock("@/use-cases/SignupUseCase");
jest.mock("@/use-cases/VerifyEmailUseCase");
jest.mock("@/use-cases/ResendVerificationUseCase");
jest.mock("passport");

describe("authController", () => {
  let mockReq: Partial<Request & { user: unknown }>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
      logIn: jest.fn(),
      user: undefined,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should return 201 and user data on successful signup", async () => {
      const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
      (SignupUseCase.prototype.execute as jest.Mock).mockResolvedValue(mockUser);

      mockReq.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: "+1234567890",
        address: "123 Test St",
      };

      await signup(mockReq as Request, mockRes as Response);

      expect(SignupUseCase).toHaveBeenCalledWith(repository, mailer);
      expect(SignupUseCase.prototype.execute).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should handle errors during signup", async () => {
      const mockError = new Error("Signup failed");
      (SignupUseCase.prototype.execute as jest.Mock).mockRejectedValue(mockError);

      mockReq.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: "+1234567890",
        address: "123 Test St",
      };

      await expect(signup(mockReq as Request, mockRes as Response)).rejects.toThrow(mockError);

      expect(SignupUseCase).toHaveBeenCalledWith(repository, mailer);
      expect(SignupUseCase.prototype.execute).toHaveBeenCalledWith(mockReq.body);
    });
  });

  describe("verifyEmail", () => {
    it("should return 200 and success message on successful email verification", async () => {
      (VerifyEmailUseCase.prototype.execute as jest.Mock).mockResolvedValue(undefined);

      mockReq.query = { token: "valid-token" };
      const command = { token: mockReq.query.token };

      await verifyEmail(mockReq as Request, mockRes as Response);

      expect(VerifyEmailUseCase).toHaveBeenCalledWith(repository);
      expect(VerifyEmailUseCase.prototype.execute).toHaveBeenCalledWith({
        token: "valid-token",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ message: "Email verified successfully" });
    });

    it("should handle errors during email verification", async () => {
      const mockError = new Error("Verification failed");
      (VerifyEmailUseCase.prototype.execute as jest.Mock).mockRejectedValue(mockError);

      mockReq.query = { token: "valid-token" };
      const command = { token: mockReq.query.token };

      await expect(verifyEmail(mockReq as Request, mockRes as Response)).rejects.toThrow(mockError);

      expect(VerifyEmailUseCase).toHaveBeenCalledWith(repository);
      expect(VerifyEmailUseCase.prototype.execute).toHaveBeenCalledWith(command);
    });
  });

  describe("resendVerificationEmail", () => {
    it("should return 200 and success message on successful resend", async () => {
      (ResendVerificationUseCase.prototype.execute as jest.Mock).mockResolvedValue(undefined);

      mockReq.body = { email: "test@example.com" };

      await resendVerificationEmail(mockReq as Request, mockRes as Response);

      expect(ResendVerificationUseCase).toHaveBeenCalledWith(repository, mailer);
      expect(ResendVerificationUseCase.prototype.execute).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Verification email resent successfully",
      });
    });

    it("should handle errors during resend verification", async () => {
      const mockError = new Error("Resend verification failed");
      (ResendVerificationUseCase.prototype.execute as jest.Mock).mockRejectedValue(mockError);

      mockReq.body = { email: "test@example.com" };

      await expect(
        resendVerificationEmail(mockReq as Request, mockRes as Response),
      ).rejects.toThrow(mockError);

      expect(ResendVerificationUseCase).toHaveBeenCalledWith(repository, mailer);
      expect(ResendVerificationUseCase.prototype.execute).toHaveBeenCalledWith(mockReq.body);
    });
  });

  describe("signin", () => {
    const mockUser: UserDTO = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      phone: null,
      address: null,
      imageUrl: null,
      jobTitle: null,
      bio: null,
    };

    it("should send user data on successful signin", () => {
      const mockAuthenticate = jest.fn((strategy, callback) => {
        callback(null, mockUser);
        return (req: Request, res: Response, next: jest.Mock) => {};
      });
      (passport.authenticate as jest.Mock).mockImplementation(mockAuthenticate);

      (mockReq.logIn as jest.Mock).mockImplementation((user, callback) => {
        callback(null);
      });

      signin(mockReq as Request, mockRes as Response, mockNext);

      expect(passport.authenticate).toHaveBeenCalledWith("local", expect.any(Function));
      expect(mockReq.logIn).toHaveBeenCalledWith(mockUser, expect.any(Function));
      expect(mockRes.send).toHaveBeenCalledWith({ user: mockUser });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error if passport.authenticate fails", () => {
      const mockError = new Error("Authentication failed");
      const mockAuthenticate = jest.fn((strategy, callback) => {
        callback(mockError, null);
        return (req: Request, res: Response, next: jest.Mock) => {};
      });
      (passport.authenticate as jest.Mock).mockImplementation(mockAuthenticate);

      signin(mockReq as Request, mockRes as Response, mockNext);

      expect(passport.authenticate).toHaveBeenCalledWith("local", expect.any(Function));
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockReq.logIn).not.toHaveBeenCalled();
      expect(mockRes.send).not.toHaveBeenCalled();
    });

    it("should call next with error if req.logIn fails", () => {
      const mockError = new Error("Login failed");
      const mockAuthenticate = jest.fn((strategy, callback) => {
        callback(null, mockUser);
        return (req: Request, res: Response, next: jest.Mock) => {};
      });
      (passport.authenticate as jest.Mock).mockImplementation(mockAuthenticate);

      (mockReq.logIn as jest.Mock).mockImplementation((user, callback) => {
        callback(mockError);
      });

      signin(mockReq as Request, mockRes as Response, mockNext);

      expect(passport.authenticate).toHaveBeenCalledWith("local", expect.any(Function));
      expect(mockReq.logIn).toHaveBeenCalledWith(mockUser, expect.any(Function));
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.send).not.toHaveBeenCalled();
    });
  });

  describe("oauthCallback", () => {
    const mockUser: UserDTO = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      phone: null,
      address: null,
      imageUrl: null,
      jobTitle: null,
      bio: null,
    };

    it("should call req.logIn and send user data if req.user exists", () => {
      mockReq.user = mockUser;
      (mockReq.logIn as jest.Mock).mockImplementation((user, callback) => {
        callback(null);
      });

      oauthCallback(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.logIn).toHaveBeenCalledWith(mockUser, expect.any(Function));
      expect(mockRes.json).toHaveBeenCalledWith({ user: mockUser });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with an AuthenticationError if req.user does not exist", () => {
      mockReq.user = undefined;

      oauthCallback(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AuthenticationError));
      expect(mockReq.logIn).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should call next with an error if req.logIn fails", () => {
      const mockError = new Error("Login failed");
      mockReq.user = mockUser;
      (mockReq.logIn as jest.Mock).mockImplementation((user, callback) => {
        callback(mockError);
      });

      oauthCallback(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.logIn).toHaveBeenCalledWith(mockUser, expect.any(Function));
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
});
