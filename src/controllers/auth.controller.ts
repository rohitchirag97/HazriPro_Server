import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { redis } from "../utils/redis.js";
import {
  requestOTPValidation,
  verifyOTPValidation,
} from "../validations/auth.validation.js";
import { otpQueue } from "../utils/otp-que.js";
import { prisma } from "../utils/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../services/jwt.service.js";
const formatZodError = (error: ZodError) => {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = await requestOTPValidation.parseAsync(req.body);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send plain OTP to queue - worker will hash and store
    await otpQueue.add("send-otp", { phone, otp });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodError(error),
      });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: { token: null } });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = await verifyOTPValidation.parseAsync(req.body);
    const hashedOtp = await redis.get(`otp:${phone}`);
    if (!hashedOtp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP", data: { token: null } });
    }
    const isOtpValid = await bcrypt.compare(otp, hashedOtp);
    if (!isOtpValid) {
      return res
        .status(400)
        .json({ message: "Invalid OTP", data: { token: null } });
    }
    await redis.del(`otp:${phone}`);
    // TODO: Generate token and return it
    const user = await prisma.employee.findUnique({
      where: { phone },
    });
    if (!user) {
      const newUser = await prisma.employee.create({
        data: {
          phone,
          fname: "New",
          lname: "User",
          role: "EMPLOYEE",
          status: "PENDING",
        },
      });
      const refreshToken = generateRefreshToken({ userId: newUser.employeeId });
      const accessToken = generateAccessToken({ userId: newUser.employeeId });
      return res
        .status(200)
        .json({ message: "OTP verified successfully", data: { accessToken, refreshToken } });
    }
    const accessToken = generateAccessToken({ userId: user.employeeId });
    const refreshToken = generateRefreshToken({ userId: user.employeeId });
    return res
      .status(200)
      .json({ message: "OTP verified successfully", data: { accessToken, refreshToken } });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodError(error),
      });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: { token: null } });
  }
};
