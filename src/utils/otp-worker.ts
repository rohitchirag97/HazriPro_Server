import { Job, Worker, type Processor } from "bullmq";
import bcrypt from "bcryptjs";
import { redis, redisConnection } from "./redis.js";
import { sendVerificationEmail } from "../services/email.service.js";

type VerificationEmailJobData = { email: string; userId: string; otp: string; name?: string };

const sendingVerificationEmail = async (job: Job<VerificationEmailJobData, void, string>) => {
  const { email, userId, otp, name } = job.data;
  
  // Generate and store OTP in Redis (24 Hours expiration)
  const hashedOtp = await bcrypt.hash(otp, 10);
  await redis.set(`email-verification:${userId}`, hashedOtp, "EX", 86400);
  
  // Send verification email with OTP using Resend
  await sendVerificationEmail({
    email,
    ...(name && { name }),
    otp,
  });
};

const queueProcessor = async (job: Job<VerificationEmailJobData, void, string>) => {
  await sendingVerificationEmail(job as Job<VerificationEmailJobData, void, string>);
};

export const otpWorker = new Worker(
  "otp-queue",
  queueProcessor as Processor<VerificationEmailJobData, void, string>,
  { connection: redisConnection }
);