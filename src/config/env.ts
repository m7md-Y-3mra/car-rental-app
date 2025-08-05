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

export const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  (() => {
    throw new Error("SESSION_SECRET environment variable is required");
  })();

export const UPSTASH_REDIS_REST_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  (() => {
    throw new Error("UPSTASH_REDIS_REST_URL environment variable is required");
  })();

export const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  (() => {
    throw new Error("GOOGLE_CLIENT_ID environment variable is required for OAuth2");
  })();
export const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET ||
  (() => {
    throw new Error("GOOGLE_CLIENT_SECRET environment variable is required for OAuth2");
  })();
export const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/v1/api/auth/google/callback";

export const FACEBOOK_APP_ID =
  process.env.FACEBOOK_APP_ID ||
  (() => {
    throw new Error("FACEBOOK_APP_ID environment variable is required for OAuth2");
  })();
export const FACEBOOK_APP_SECRET =
  process.env.FACEBOOK_APP_SECRET ||
  (() => {
    throw new Error("FACEBOOK_APP_SECRET environment variable is required for OAuth2");
  })();
export const FACEBOOK_CALLBACK_URL =
  process.env.FACEBOOK_CALLBACK_URL || "http://localhost:3000/v1/api/auth/facebook/callback";

export const TWITTER_CLIENT_ID =
  process.env.TWITTER_CLIENT_ID ||
  (() => {
    throw new Error("TWITTER_CLIENT_ID environment variable is required for OAuth2");
  })();
export const TWITTER_CLIENT_SECRET =
  process.env.TWITTER_CLIENT_SECRET ||
  (() => {
    throw new Error("TWITTER_CLIENT_SECRET environment variable is required for OAuth2");
  })();
export const TWITTER_CALLBACK_URL =
  process.env.TWITTER_CALLBACK_URL || "http://localhost:3000/v1/api/auth/twitter/callback";
