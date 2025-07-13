import { JWT_SECRET } from "@/config/env";
import InvalidTokenError from "@/errors/InvalidTokenError";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError, sign, verify } from "jsonwebtoken";

interface TokenPayload {
  id: number;
}

export const generateToken = (payload: TokenPayload) => {
  return sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string): TokenPayload => {
  if (!token || token.trim() === "") {
    throw new InvalidTokenError({
      message: "Token is required",
      statusCode: 400,
      code: "ERR_TOKEN_REQUIRED",
    });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as TokenPayload;

    if (!isValidTokenPayload(decoded)) {
      throw new InvalidTokenError({
        message: "Token payload is invalid",
        statusCode: 400,
        code: "ERR_INVALID_PAYLOAD",
      });
    }

    return decoded;
  } catch (error) {
    throw handleJwtError(error);
  }
};

const isValidTokenPayload = (payload: unknown): payload is TokenPayload => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    typeof payload.id === "number"
  );
};

const handleJwtError = (error: unknown): never => {
  if (error instanceof InvalidTokenError) {
    throw error;
  }

  if (error instanceof TokenExpiredError) {
    throw new InvalidTokenError({
      message: "Token has expired",
      statusCode: 401,
      code: "ERR_TOKEN_EXPIRED",
    });
  }

  if (error instanceof NotBeforeError) {
    throw new InvalidTokenError({
      message: "Token not yet valid",
      statusCode: 401,
      code: "ERR_TOKEN_NOT_ACTIVE",
    });
  }

  if (error instanceof JsonWebTokenError) {
    throw new InvalidTokenError({
      message: "Invalid token format",
      statusCode: 400,
      code: "ERR_INVALID_TOKEN",
    });
  }

  throw new InvalidTokenError({
    message: "Token verification failed",
    statusCode: 400,
    code: "ERR_TOKEN_VERIFICATION",
  });
};
