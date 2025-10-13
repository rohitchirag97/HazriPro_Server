import { Request, Response } from "express";
import { checkIn, checkOut, manualAttendance as manualAttendanceService } from "../services/attendance.service";

export const checkInAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const data = await checkIn(employeeId, req.user.companyId);
    return res.status(200).json({
      success: true,
      message: "Attendance checked in successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const checkOutAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const data = await checkOut(employeeId, req.user.companyId);
    return res.status(200).json({
      success: true,
      message: "Attendance checked out successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const manualAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId, status } = req.body;
    const data = await manualAttendanceService(employeeId, status);
    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
