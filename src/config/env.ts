export const ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 3000;
export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
export const APP_DEBUG = process.env.APP_DEBUG === "true";
console.log(APP_DEBUG, process.env);

export const SMTP_HOST = process.env.SMTP_HOST || "smtp.example.com";
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
export const SMTP_USER = process.env.SMTP_USER || "user@example.com";
export const SMTP_PASS = process.env.SMTP_PASS || "password";
export const SMTP_FROM = process.env.SMTP_FROM || "noreply@example.com";

export const JWT_TOKEN = process.env.JWT_TOKEN || "secret key";

export const consoleLogEmails = process.env.CONSOLE_LOG_EMAILS === "true";
