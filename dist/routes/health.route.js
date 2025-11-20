"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleHealthCheck = exports.healthCheck = void 0;
const express_1 = require("express");
const prisma_1 = require("../config/prisma");
const redis_1 = __importDefault(require("../config/redis"));
const healthRouter = (0, express_1.Router)();
const healthCheck = async (req, res) => {
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
            await prisma_1.prisma.$queryRaw `SELECT 1`;
            health.services.database = "healthy";
        }
        catch (error) {
            health.services.database = "unhealthy";
            health.status = "unhealthy";
        }
        // Check Redis connection
        try {
            await redis_1.default.ping();
            health.services.redis = "healthy";
        }
        catch (error) {
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
    }
    catch (error) {
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
exports.healthCheck = healthCheck;
// Simple health check endpoint (for load balancers)
const simpleHealthCheck = async (req, res) => {
    return res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
};
exports.simpleHealthCheck = simpleHealthCheck;
healthRouter.get("/", exports.healthCheck);
healthRouter.get("/simple", exports.simpleHealthCheck);
exports.default = healthRouter;
