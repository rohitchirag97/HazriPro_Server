import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/jwt.service.js";
import { Status, type Employee } from "../generated/prisma/client.js";
import { prisma } from "../utils/prisma.js";
import {
  getCache,
  setCache,
  CACHE_KEYS,
  CACHE_TTL,
} from "../utils/cache.js";

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

  // Try to get user from cache first
  const cacheKey = CACHE_KEYS.user(decoded.userId);
  let user = await getCache<Employee>(cacheKey);

  if (!user) {
    // Cache miss - fetch from database
    user = await prisma.employee.findUnique({
      where: { id: decoded.userId },
    });

    if (user) {
      // Store in cache for future requests
      await setCache(cacheKey, user, CACHE_TTL.USER);
    }
  }

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  if (user.status !== Status.ACTIVE) {
    return res.status(401).json({ message: "User is not active" });
  }
  req.user = user;
  next();
};
