export const ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 3000;
export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
export const APP_DEBUG = process.env.APP_DEBUG === "true";

export const SMTP_HOST = process.env.SMTP_HOST || "smtp.example.com";
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
export const SMTP_USER = process.env.SMTP_USER || "user@example.com";
export const SMTP_PASS = process.env.SMTP_PASS || "password";
export const SMTP_FROM = process.env.SMTP_FROM || "noreply@example.com";

export const JWT_SECRET =
  process.env.JWT_SECRET ||
  (() => {
    throw new Error("JWT_SECRET environment variable is required");
  })();

export const CONSOLE_LOG_EMAILS = process.env.CONSOLE_LOG_EMAILS === "true";

export const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export const SESSION_SECRET = process.env.SESSION_SECRET || "your_strong_secret_here";

export const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || "";
export const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "";
