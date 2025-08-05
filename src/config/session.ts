import { RedisStore } from "connect-redis";
import session from "express-session";
import { ENV, SESSION_SECRET, UPSTASH_REDIS_REST_URL } from "./env";

import { createClient } from "redis";

// Create Redis client
const redisClient = createClient({
  url: UPSTASH_REDIS_REST_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.connect().then(() => console.log("Redis client connected"));

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
