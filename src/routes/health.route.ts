import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import redis from "../config/redis";

const healthRouter = Router();

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      services: {
        database: "unknown",
        redis: "unknown",
        api: "healthy"
      }
    };

    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      health.services.database = "healthy";
    } catch (error) {
      health.services.database = "unhealthy";
      health.status = "unhealthy";
    }

    // Check Redis connection
    try {
      await redis.ping();
      health.services.redis = "healthy";
    } catch (error) {
      health.services.redis = "unhealthy";
      health.status = "unhealthy";
    }

    // Determine overall status
    const isHealthy = health.services.database === "healthy" && 
                     health.services.redis === "healthy";

    const statusCode = isHealthy ? 200 : 503;

    return res.status(statusCode).json({
      success: isHealthy,
      message: isHealthy ? "All services are healthy" : "Some services are unhealthy",
      data: health
    });

  } catch (error) {
    return res.status(503).json({
      success: false,
      message: "Health check failed",
      error: error instanceof Error ? error.message : "Unknown error",
      data: {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          database: "unknown",
          redis: "unknown",
          api: "unhealthy"
        }
      }
    });
  }
};

// Simple health check endpoint (for load balancers)
export const simpleHealthCheck = async (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
};

healthRouter.get("/", healthCheck);
healthRouter.get("/simple", simpleHealthCheck);

export default healthRouter;
