import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";

export const createShift = async (req: Request, res: Response) => {
  try {
    const { name, startTime, endTime } = req.body;
    // Take only the hour and minute from startTime and endTime (assuming they could be full DateTimes)
    // If format is already HH:mm, this does nothing. If it's a full ISO, we extract.
    const extractHourMinute = (dt: string) => {
      const dateObj = new Date(dt);
      if (!isNaN(dateObj.getTime())) {
        // Date parsing successful, return HH:mm
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      }
      // Otherwise, assume it's already properly formatted and return as is
      return dt;
    };

    const formattedStartTime = extractHourMinute(startTime);
    const formattedEndTime = extractHourMinute(endTime);

    // Overwrite startTime and endTime with the formatted values
    req.body.startTime = formattedStartTime;
    req.body.endTime = formattedEndTime;
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    if (req.user.role !== Role.SUPER_ADMIN) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to create a shift",
      });
    }
    if (!name || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Name, start time and end time are required",
      });
    }
    const shift = await prisma.shift.create({
      data: { name, startTime, endTime, companyId: companyId },
    });
    return res.status(200).json({
      success: true,
      message: "Shift created successfully",
      shift: shift,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getShifts = async (req: Request, res: Response) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const shifts = await prisma.shift.findMany({
      where: { companyId: companyId },
    });
    return res.status(200).json({
      success: true,
      message: "Shifts fetched successfully",
      shifts: shifts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
