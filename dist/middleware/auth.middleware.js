"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_service_1 = require("../services/jwt.service");
const prisma_1 = require("../config/prisma");
const authenticate = async (req, res, next) => {
    try {
        let token;
        // Check for token in Authorization header (Mobile Apps - from localStorage)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        // Check for token in cookies (Web Apps - automatic cookie handling)
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not provided. Send token in Authorization header (mobile) or cookie (web)",
            });
        }
        let decoded;
        try {
            decoded = (0, jwt_service_1.verifyToken)(token);
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }
        const user = await prisma_1.prisma.employee.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
};
exports.authenticate = authenticate;
