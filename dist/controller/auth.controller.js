"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getUser = exports.verifyOTP = exports.sendOTP = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const redis_1 = __importDefault(require("../config/redis"));
const prisma_1 = require("../config/prisma");
const jwt_service_1 = require("../services/jwt.service");
const token_service_1 = require("../services/token.service");
const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required",
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const hashedOTP = await bcrypt_1.default.hash(otp.toString(), 10);
        await redis_1.default.set(phone, hashedOTP, { EX: 10 * 60 });
        console.log(otp);
        // TODO: Send OTP to phone number
        return res.status(200).json({
            success: true,
            message: `OTP sent successfully, Please enter the otp to verify your account`,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
exports.sendOTP = sendOTP;
const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone number and OTP are required",
            });
        }
        const storedOTP = await redis_1.default.get(phone);
        if (!storedOTP) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }
        const isValidOTP = await bcrypt_1.default.compare(otp, storedOTP);
        if (!isValidOTP) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }
        await redis_1.default.del(phone);
        const user = await prisma_1.prisma.employee.findUnique({
            where: {
                phone: phone,
            },
        });
        if (!user) {
            const newUser = await prisma_1.prisma.employee.create({
                data: {
                    phone: phone,
                    fname: "New",
                    lname: "User",
                },
            });
            const token = (0, jwt_service_1.generateToken)(newUser.id);
            await (0, token_service_1.saveToken)(phone, token);
            // Set token in cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            return res.status(200).json({
                success: true,
                message: "User Logged In successfully",
                token: token,
            });
        }
        const token = (0, jwt_service_1.generateToken)(user.id);
        await (0, token_service_1.saveToken)(phone, token);
        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.status(200).json({
            success: true,
            message: "User Logged In successfully",
            token: token,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
exports.verifyOTP = verifyOTP;
const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: user,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
exports.getUser = getUser;
const logout = async (req, res) => {
    try {
        const { phone } = req.body;
        // Remove token from Redis
        if (phone) {
            await (0, token_service_1.removeToken)(phone);
        }
        // Clear the cookie
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
exports.logout = logout;
