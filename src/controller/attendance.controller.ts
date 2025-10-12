import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const startTimeAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId, startTime } = req.body;
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId, companyId },
      include: {
        shift: true,
      },
    });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee not found",
      });
    }
    if (employee.shift?.startTime === startTime) {
      const attendance = await prisma.attendance.create({
        data: { 
          employeeId, 
          companyId, 
          inTime: new Date(startTime),
          date: new Date()
        },
      });
      return res.status(200).json({
        success: true,
        message: "Entry time Attendance marked",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
