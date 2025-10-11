import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
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
        message: "You are not authorized to create a department",
      });
    }
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    const department = await prisma.department.create({
      data: { name, companyId: companyId },
    });
    return res.status(200).json({
      success: true,
      message: "Department created successfully",
      department: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const departments = await prisma.department.findMany({
      where: { companyId: companyId },
    });
    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      departments: departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
