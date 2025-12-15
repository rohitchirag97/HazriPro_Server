import type { Employee, User } from "./generated/prisma/client.js";

export type UserWithRelations = User & {
  employee?: Employee | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserWithRelations;
      employee?: Employee | null;
    }
  }
}

