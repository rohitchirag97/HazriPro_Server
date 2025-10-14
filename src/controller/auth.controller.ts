import { Request, Response } from "express";
import bcrypt from "bcrypt";
import redis from "../config/redis";
import { prisma } from "../config/prisma";
import { generateToken } from "../services/jwt.service";
import { removeToken, saveToken } from "../services/token.service";

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOTP = await bcrypt.hash(otp.toString(), 10);
    await redis.set(phone, hashedOTP, { EX: 10 * 60 });
    console.log(otp);
    // TODO: Send OTP to phone number
    return res.status(200).json({
      success: true,
      message: `OTP sent successfully, Please enter the otp to verify your account`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }
    const storedOTP = await redis.get(phone);
    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }
    const isValidOTP = await bcrypt.compare(otp, storedOTP);
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    await redis.del(phone);
    const user = await prisma.employee.findUnique({
      where: {
        phone: phone,
      },
    });
    if (!user) {
      const newUser = await prisma.employee.create({
        data: {
          phone: phone,
          fname: "New",
          lname: "User",
        },
      });
      const token = generateToken(newUser.id);
      await saveToken(phone, token);
      
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
    const token = generateToken(user.id);
    await saveToken(phone, token);
    
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    
    // Remove token from Redis
    if (phone) {
      await removeToken(phone);
    }
    
    // Clear the cookie
    res.clearCookie('token');
    
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
