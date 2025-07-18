import { Redis } from "@upstash/redis";
import { RedisStore } from "connect-redis";
import session from "express-session";
import { ENV, SESSION_SECRET, UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from "./env";

const redisClient = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

// Test Redis connection
redisClient.ping().catch((err) => {
  console.error("Redis connection failed:", err);
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "carrental:",
});

export const sessionMiddleware = session({
  store: redisStore,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: ENV === "production", // Use secure cookies in production
    httpOnly: true,
  },
});
