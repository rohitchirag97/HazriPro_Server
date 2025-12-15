import { z } from "zod";

export const registerUserValidation = z
  .object({
    email: z.string("Email is required").email("Invalid email address"),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(255, "Password must be less than 255 characters"),
    fname: z
      .string("First name is required")
      .min(1, "First name is required")
      .max(255, "First name must be less than 255 characters"),
    lname: z
      .string("Last name is required")
      .min(1, "Last name is required")
      .max(255, "Last name must be less than 255 characters"),
  })
  .strict();

export const verifyEmailValidation = z
  .object({
    email: z.string("Email is required").email("Invalid email address"),
    otp: z.string("OTP is required").length(6, "OTP must be 6 digits"),
  })
  .strict();

export const loginUserValidation = z
  .object({
    email: z.string("Email is required").email("Invalid email address"),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(255, "Password must be less than 255 characters"),
  })
  .strict();
