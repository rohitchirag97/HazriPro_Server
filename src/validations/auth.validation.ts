import { z } from "zod";

export const requestOTPValidation = z.object({
    phone: z.string().min(10).max(10),
}).strict(); 

export const verifyOTPValidation = z.object({
    phone: z.string().trim().min(10).max(10),
    otp: z.string().trim().min(6).max(6),
}).strict(); 