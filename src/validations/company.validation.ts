import { z } from "zod";

export const createCompanyValidation = z
  .object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    address: z.string().optional(),
    logo: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().optional(),
    isEmployee: z.boolean().optional(),
  })
  .strict();

export const updateCompanyValidation = z
  .object({
    name: z.string().min(1).max(255).optional(),
    slug: z.string().min(1).max(255).optional(),
    address: z.string().optional(),
    logo: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().optional(),
  })
  .strict();
