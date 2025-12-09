import { Job, Worker, type Processor } from "bullmq";
import bcrypt from "bcryptjs";
import { redis, redisConnection } from "./redis.js";

const sendingOTP = async (job: Job<{ phone: string; otp: string }, void, string>) => {
  const { phone, otp } = job.data;
  
  // Hash the OTP before storing in Redis
  const hashedOtp = await bcrypt.hash(otp, 10);
  await redis.set(`otp:${phone}`, hashedOtp, "EX", 600);
  
  // Print OTP to console for testing (remove in production)
  console.log(`\n========== OTP ==========`);
  console.log(`Phone: ${phone}`);
  console.log(`OTP: ${otp}`);
  console.log(`=========================\n`);
};

export const otpWorker = new Worker(
  "otp-queue",
  sendingOTP as Processor<{ phone: string; otp: string }, void, string>,
  { connection: redisConnection }
);