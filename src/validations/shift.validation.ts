import { z } from "zod";

export const createShiftValidation = z.object({
    name: z.string().min(1).max(255),
    startTime: z.date(),
    endTime: z.date(),
}).strict();

export const updateShiftValidation = z.object({
    name: z.string().min(1).max(255).optional(),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
}).strict();