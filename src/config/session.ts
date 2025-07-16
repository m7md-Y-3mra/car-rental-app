import session from "express-session";
import { ENV, SESSION_SECRET } from "./env";

export const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: ENV === "production", // Use secure cookies in production
    httpOnly: true,
  },
});
