import type { Request, Response } from "express";
import { formatZodError } from "../utils/zod.error.js";
import { ZodError } from "zod";
import {
  createShiftValidation,
  updateShiftValidation,
} from "../validations/shift.validation.js";
import { Role, type Employee } from "../generated/prisma/client.js";
import { prisma } from "../utils/prisma.js";

export const createShift = async (req: Request, res: Response) => {
  try {
    const { name, startTime, endTime } = await createShiftValidation.parseAsync(
      req.body
    );
    const user = req.user?.employee;
    if (!user) {
      return res.status(401).json({ message: "Employee not found" });
    }
    if (!user.companyId) {
      return res.status(400).json({
        message: "User is not assigned to a company, please contact support",
      });
    }
    if (user.role !== Role.OWNER) {
      return res.status(403).json({
        message: "You are not authorized to create this shift",
      });
    }
    const newShift = await prisma.shift.create({
      data: {
        name,
        startTime,
        endTime,
        companyId: user.companyId,
      },
    });
    return res.status(200).json({
      message: "Shift created successfully",
      data: { shift: newShift },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodError(error),
      });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: { shift: null } });
  }
};

export const getShifts = async (req: Request, res: Response) => {
  try {
    const user = req.user?.employee;
    if (!user) {
      return res.status(401).json({ message: "Employee not found" });
    }
    if (!user.companyId) {
      return res.status(400).json({
        message: "User is not assigned to a company, please contact support",
      });
    }
    const shifts = await prisma.shift.findMany({
      where: { companyId: user.companyId },
    });
    return res.status(200).json({
      message: "Shifts fetched successfully",
      data: { shifts: shifts },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: { shifts: null } });
  }
};

export const getShift = async (req: Request, res: Response) => {
  try {
    const user = req.user?.employee;
    if (!user) {
      return res.status(401).json({ message: "Employee not found" });
    }
    if (!user.companyId) {
      return res.status(400).json({
        message: "User is not assigned to a company, please contact support",
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Shift ID is required" });
    }
    const shift = await prisma.shift.findUnique({
      where: { id: id },
      include: {
        employees: true,
      },
    });
    if (!shift || shift.companyId !== user.companyId) {
      return res.status(404).json({
        message:
          "Shift not found or you are not authorized to access this shift",
      });
    }
    return res
      .status(200)
      .json({ message: "Shift fetched successfully", data: { shift: shift } });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: { shift: null } });
  }
};

export const updateShift = async (req: Request, res: Response) => {
  try {
    const user = req.user?.employee;
    if (!user) {
      return res.status(401).json({ message: "Employee not found" });
    }
    if (!user.companyId) {
      return res.status(400).json({
        message: "User is not assigned to a company, please contact support",
      });
    }
    if (user.role !== Role.OWNER) {
      return res.status(403).json({
        message: "You are not authorized to update this shift",
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Shift ID is required" });
    }
    const { name, startTime, endTime } = await updateShiftValidation.parseAsync(
      req.body
    );
    const shift = await prisma.shift.findUnique({
      where: { id: id },
    });
    if (!shift || shift.companyId !== user.companyId) {
      return res.status(404).json({
        message:
          "Shift not found or you are not authorized to access this shift",
      });
    }
    const updatedShift = await prisma.shift.update({
      where: { id: id },
      data: {
        name: name ? name : shift.name,
        startTime: startTime ? startTime : (shift.startTime as Date),
        endTime: endTime ? endTime : (shift.endTime as Date),
      },
    });
    return res.status(200).json({
      message: "Shift updated successfully",
      data: { shift: updatedShift },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatZodError(error),
      });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: { shift: null } });
  }
};

export const deleteShift = async (req: Request, res: Response) => {
  try {
    const user = req.user?.employee;
    if (!user) {
      return res.status(401).json({ message: "Employee not found" });
    }
    if (!user.companyId) {
      return res.status(400).json({
        message: "User is not assigned to a company, please contact support",
      });
    }
    if (user.role !== Role.OWNER) {
      return res.status(403).json({
        message: "You are not authorized to delete this shift",
      });
    }
    if (user.role !== Role.OWNER) {
      return res.status(403).json({
        message: "You are not authorized to delete this shift",
      });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Shift ID is required" });
    }
    const shift = await prisma.shift.findUnique({
      where: { id: id },
      include: {
        employees: true,
      },
    });
    if (!shift || shift.companyId !== user.companyId) {
      return res.status(404).json({
        message:
          "Shift not found or you are not authorized to access this shift",
      });
    }
    if (shift.employees.length > 0) {
      return res.status(400).json({
        message: "Shift has employees assigned to it, please remove them first",
      });
    }
    const deletedShift = await prisma.shift.delete({
      where: { id: id },
    });
    return res.status(200).json({
      message: "Shift deleted successfully",
      data: { shift: deletedShift },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: { shift: null } });
  }
};
