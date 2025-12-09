import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const otpQueue = new Queue("otp-queue", {
  connection: redisConnection,
});
