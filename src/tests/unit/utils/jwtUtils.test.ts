import { JWT_TOKEN } from "@/config/env";
import InvalidTokenError from "@/errors/InvalidTokenError";
import { generateToken, verifyToken } from "@/utils/jwtUtils";
import { JsonWebTokenError, sign, TokenExpiredError, verify } from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("JWT Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateToken", () => {
    it("should generate a valid token", () => {
      const payload = { id: 1 };
      (sign as jest.Mock).mockReturnValue("mock-token");

      const token = generateToken(payload);

      expect(token).toBe("mock-token");
      expect(sign).toHaveBeenCalledWith(payload, JWT_TOKEN, { expiresIn: "1d" });
    });
  });

  describe("verifyToken", () => {
    const validPayload = { id: 1 };

    it("should verify a valid token", () => {
      (verify as jest.Mock).mockReturnValue(validPayload);

      const token = "valid-token";
      const result = verifyToken(token);

      expect(result).toEqual(validPayload);
      expect(verify).toHaveBeenCalledWith(token, JWT_TOKEN);
    });

    it("should throw for empty token", () => {
      expect(() => verifyToken("")).toThrow(InvalidTokenError);
      expect(() => verifyToken("")).toThrow("Token is required");
    });

    it("should throw for expired token", () => {
      (verify as jest.Mock).mockImplementation(() => {
        throw new TokenExpiredError("TokenExpiredError", new Date());
      });

      const token = "expired-token";

      expect(() => verifyToken(token)).toThrow(InvalidTokenError);
      expect(() => verifyToken(token)).toThrow("Token has expired");
    });

    it("should throw for invalid payload", () => {
      (verify as jest.Mock).mockReturnValue({ foo: "bar" });

      const token = "invalid-payload-token";

      expect(() => verifyToken(token)).toThrow(InvalidTokenError);
      expect(() => verifyToken(token)).toThrow("Token payload is invalid");
    });

    it("should throw for malformed token", () => {
      (verify as jest.Mock).mockImplementation(() => {
        throw new JsonWebTokenError("JsonWebTokenError");
      });

      const token = "malformed-token";

      expect(() => verifyToken(token)).toThrow(InvalidTokenError);
      expect(() => verifyToken(token)).toThrow("Invalid token format");
    });

    it("should throw for unknown verification error", () => {
      (verify as jest.Mock).mockImplementation(() => {
        throw new Error("Unknown error");
      });

      const token = "unknown-error-token";

      expect(() => verifyToken(token)).toThrow(InvalidTokenError);
      expect(() => verifyToken(token)).toThrow("Token verification failed");
    });
  });
});
