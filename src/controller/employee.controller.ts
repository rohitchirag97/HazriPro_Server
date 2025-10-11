import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";
import { rekognition, s3 } from "../services/aws.service";

export const createEmployee = async (req: Request, res: Response) => {
  try {
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
      data: { fname, lname, phone, shiftId, departmentId, companyId },
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
    const { id } = req.params;
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
        message: "You are not authorized to index an employee face",
      });
    }
    const employee = await prisma.employee.findUnique({
      where: { id, companyId },
    });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee not found",
      });
    }
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "Image file is required for face indexing",
      });
    }
    const params = {
      CollectionId: process.env.REKOGNITION_COLLECTION_ID!,
      Image: {
        Bytes: req.file.buffer,
      },
      ExternalImageId: id,
      DetectionAttributes: [],
    };
    let rekognitionResponse;
    try {
      rekognitionResponse = await rekognition.indexFaces(params).promise();
    } catch (rekognitionError) {
      return res.status(500).json({
        success: false,
        message: "Error indexing face with AWS Rekognition",
        error: rekognitionError,
      });
    }
    if (
      !rekognitionResponse.FaceRecords ||
      rekognitionResponse.FaceRecords.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No face detected in the image",
      });
    }

    const s3Response = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `employees/${id}.jpg`,
        Body: req.file.buffer,
      })
      .promise();
    await prisma.employee.update({
      where: { id, companyId },
      data: {
        faceId: rekognitionResponse.FaceRecords[0].Face?.FaceId,
        faceUrl: s3Response.Location,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Employee indexed successfully",
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

export const verifyEmployeeFace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
        message: "You are not authorized to verify an employee face",
      });
    }
    const employee = await prisma.employee.findUnique({
      where: { id, companyId },
    });
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee not found",
      });
    }
    if (!employee.faceId) {
      return res.status(400).json({
        success: false,
        message: "Employee face not indexed",
      });
    }
    const params = {
      CollectionId: process.env.REKOGNITION_COLLECTION_ID!,
      Image: {
        Bytes: req.file.buffer,
      },
      MaxFaces: 1,
      FaceMatchThreshold: 80,
    };
    let rekognitionResponse;
    try {
      rekognitionResponse = await rekognition.searchFacesByImage(params).promise();
    } catch (rekognitionError) {
      return res.status(500).json({
        success: false,
        message: "Error verifying employee face with AWS Rekognition",
        error: rekognitionError,
      });
    }
    if (
      !rekognitionResponse.FaceMatches ||
      rekognitionResponse.FaceMatches.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No face matches found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee face verified successfully",
      employee: employee,
      faceMatches: rekognitionResponse.FaceMatches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
