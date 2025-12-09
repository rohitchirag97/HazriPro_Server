import "dotenv/config";
import { Redis } from "ioredis";

// Redis connection config from environment variables
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);

// Initialize Redis client
export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

// Export connection config for BullMQ
export const redisConnection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};
