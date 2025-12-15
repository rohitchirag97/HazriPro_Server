import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/jwt.service.js";
import { Status } from "../generated/prisma/client.js";
import { prisma } from "../utils/prisma.js";
import type { UserWithRelations } from "../express.d.ts";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      employee: true,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // Set both user and employee in request
  req.user = user;
  req.employee = user.employee || null;

  // Check if employee is active (if employee exists)
  if (user.employee && user.employee.status !== Status.ACTIVE) {
    return res.status(401).json({ message: "User is not active" });
  }

  next();
};
