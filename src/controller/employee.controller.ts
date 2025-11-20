import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";
import { addImageToS3, indexFace, searchfacebyimage as searchFaceByImageAWS } from "../services/aws.service";

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return ".jpg";
  }
}

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { fname, lname, phone, role, shiftId, departmentId } = req.body;
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
        message: "You are not authorized to create an employee",
      });
    }
    if (!fname || !phone) {
      return res.status(400).json({
        success: false,
        message: "Fname and phone are required",
      });
    }
    const existingEmployee = await prisma.employee.findUnique({
      where: { phone },
    });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }
    const employee = await prisma.employee.create({
      data: { fname, lname, phone, role, shiftId, departmentId, companyId },
    });
    return res.status(200).json({
      success: true,
      message: "Employee created successfully",
      employee: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const employees = await prisma.employee.findMany({
      where: { companyId },
      include: {
        shift: {
          select: {
            name: true,
            startTime: true,
            endTime: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      employees: employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getEmployeebyId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const employee = await prisma.employee.findUnique({
      where: { id, companyId },
      include: {
        shift: {
          select: {
            name: true,
            startTime: true,
            endTime: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getEmployeebyPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }
    const employee = await prisma.employee.findUnique({
      where: { phone, companyId },
      include: {
        shift: {
          select: {
            name: true,
            startTime: true,
            endTime: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fname, lname, phone, shiftId, departmentId } = req.body;
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
        message: "You are not authorized to update an employee",
      });
    }
    if (!fname || !phone) {
      return res.status(400).json({
        success: false,
        message: "Fname and phone are required",
      });
    }
    const employee = await prisma.employee.update({
      where: { id, companyId },
      data: { fname, lname, phone, shiftId, departmentId },
    });
    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const indexEmployeeFace = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const file = req.file;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "File type not allowed",
      });
    }
    const bytes = file.buffer;
    const ext = extFromMime(file.mimetype);

    // send image bytes and employeeid to aws service index face
    const awsResult = await indexFace(bytes, employeeId);
    if (!awsResult.success) {
      return res.status(400).json({
        success: false,
        message: awsResult.message || "Failed to index face",
        error: awsResult.error || undefined,
      });
    }

    // add image to s3 bucket
    const s3Result = await addImageToS3(bytes, employeeId);
    if (!s3Result.success) {
      return res.status(400).json({
        success: false,
        message: s3Result.message || "Failed to add image to s3",
        error: s3Result.error || undefined,
      });
    }
    const key = s3Result.key;
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: { faceId: awsResult.faceId, faceUrl: s3Result.key },
    });
    return res.status(200).json({
      success: true,
      message: "Face indexed successfully",
      faceId: awsResult.faceId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

  export const searchfacebyimage = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "File type not allowed",
      });
    }
    const bytes = file.buffer;
    const awsResult = await searchFaceByImageAWS(bytes);
    if (!awsResult.success) {
      return res.status(400).json({
        success: false,
        message: awsResult.message || "Failed to search face",
        error: awsResult.error || undefined,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Face searched successfully",
      faceId: awsResult.faceId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};