import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis
  .connect()
  .then(() => {
    console.log("Redis connected successfully");
  })
  .catch((err) => {
    console.log("Redis connection failed", err);
  });

export default redis;
