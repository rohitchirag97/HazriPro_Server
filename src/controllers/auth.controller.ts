import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { redis } from "../utils/redis.js";
import {
  registerUserValidation,
  verifyEmailValidation,
  loginUserValidation,
} from "../validations/auth.validation.js";
import { otpQueue } from "../utils/otp-que.js";
import { prisma } from "../utils/prisma.js";
import { generateToken } from "../services/jwt.service.js";
import { generateOTP } from "../utils/otp-generator.js";
import { formatZodError } from "../utils/zod.error.js";
import { Role } from "../generated/prisma/client.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, fname, lname } =
      await registerUserValidation.parseAsync(req.body);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        fname: fname,
        lname: lname,
      },
    });

    // Generate OTP for email verification
    const otp = generateOTP(6);

    // Queue verification email job
    await otpQueue.add("verification-email", {
      email: email,
      userId: newUser.id,
      otp: otp,
      name: `${fname} ${lname}`,
    });

    return res.status(200).json({
      message:
        "User Verifiaction OTP Sent to Email, please check your email and enter the OTP to verify your email address",
    });
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
      .json({ message: "Internal server error", data: { user: null } });
  }
};

export const verifyEmailOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = await verifyEmailValidation.parseAsync(req.body);
    const user = await prisma.user.findUnique({
      where: { email, isVerified: false },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found or already verified",
      });
    }

    const storedOtp = await redis.get(`email-verification:${user.id}`);
    if (!storedOtp) {
      return res.status(400).json({
        message: "OTP has expired or is invalid. Please request a new OTP.",
      });
    }

    const isValidOtp = await bcrypt.compare(otp, storedOtp);
    if (!isValidOtp) {
      return res.status(400).json({
        message: "Invalid OTP. Please check and try again.",
      });
    }

    await redis.del(`email-verification:${user.id}`);
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, updatedAt: new Date() },
    });

    return res.status(200).json({
      message: "Email verified successfully, you can now login to your account",
    });
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
      .json({ message: "Internal server error", data: { user: null } });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = await loginUserValidation.parseAsync(req.body);
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Username or password is incorrect" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Username or password is incorrect" });
    }
    if (!user.isVerified) {
      return res
        .status(401)
        .json({
          message: "Email not verified, please verify your email to login",
        });
    }
    const employee = await prisma.employee.findUnique({
      where: { userId: user.id },
    });
    const company = await prisma.company.findFirst({
      where: { ownerId: user.id },
    });
    const accessToken = generateToken({
      userId: user.id,
      employeeId: employee?.id ?? "",
      role: employee?.role ?? Role.EMPLOYEE,
      isEmployee: employee?.isEmployee ?? false,
      companyId: company?.id ?? "",
    });
    return res.status(200).json({
      message: "User Logged in successfully",
      data: {
        accessToken: accessToken,
        Role: employee?.role ?? Role.EMPLOYEE,
        companyId: company?.id ?? "",
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodError(error),
      });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", data: { accessToken: null } });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const employee = req.employee;
    return res.status(200).json({
      message: "User fetched successfully",
      data: { user: user, employee: employee },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        data: { user: null, employee: null },
      });
  }
};
