import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;
    if (req.user.companyId) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of a company, only one company is allowed",
      });
    }
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }
    const existingCompany = await prisma.company.findUnique({
      where: {
        slug,
      },
    });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }
    const company = await prisma.company.create({
      data: {
        name,
        slug,
      },
    });
    await prisma.employee.update({
      where: {
        id: req.user.id,
      },
      data: {
        companyId: company.id,
        role: Role.SUPER_ADMIN,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Company created successfully",
      company: company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getUserCompanies = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const companies = await prisma.company.findMany({
      where: {
        employees: {
          some: { id: user.id },
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Companies fetched successfully",
      companies: companies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
