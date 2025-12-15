import type { Request, Response } from "express";
import { ZodError } from "zod";
import { formatZodError } from "../utils/zod.error.js";
import { prisma } from "../utils/prisma.js";
import {
  createCompanyValidation,
  updateCompanyValidation,
} from "../validations/company.validation.js";
import {
  Role,
  Status,
  type Employee,
  type Company,
  type Shift,
  type Department,
} from "../generated/prisma/client.js";

type CompanyWithRelations = Company & {
  employees: Employee[];
  shifts: Shift[];
  departments: Department[];
};

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, slug, address, logo, phone, email, website, isEmployee } =
      await createCompanyValidation.parseAsync(req.body);
    const user = req.user?.employee;
    if (!user) {
      return res.status(401).json({ message: "Employee not found" });
    }
    if (user.companyId) {
      return res.status(400).json({
        message: "User already assigned to a company, please contact support",
      });
    }
    const company = await prisma.company.findUnique({
      where: { slug: slug },
    });
    if (company) {
      return res.status(400).json({
        message:
          "Company with this slug already exists, please use a different slug",
      });
    }
    const newCompany = await prisma.company.create({
      data: {
        name: name,
        slug: slug,
        address: address ?? null,
        logo: logo ?? null,
        phone: phone ?? null,
        email: email ?? null,
        website: website ?? null,
      },
    });
    await prisma.employee.update({
      where: { id: user.id },
      data: {
        companyId: newCompany.id,
        role: Role.OWNER,
        status: Status.ACTIVE,
        isEmployee: isEmployee ?? false,
      },
    });

    return res.status(200).json({
      message: "Company created successfully",
      data: { company: newCompany },
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
      .json({ message: "Internal server error", data: { company: null } });
  }
};

export const getCompany = async (req: Request, res: Response) => {
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

    const company = await prisma.company.findUnique({
      where: { id: user.companyId },
      include: {
        employees: true,
        shifts: true,
        departments: true,
      },
    });

    return res.status(200).json({
      message: "Company fetched successfully",
      data: { company: company },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: { company: null } });
  }
};

export const getCompanyBySlug = async (req: Request, res: Response) => {
  try {
    const user = req.user?.employee;
    if (!user) {
      return res.status(401).json({ message: "Employee not found" });
    }
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        employees: true,
        shifts: true,
        departments: true,
      },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (user.companyId && user.companyId !== company.id) {
      return res
        .status(400)
        .json({ message: "User is not authorized to access this company" });
    }
    return res.status(200).json({
      message: "Company fetched successfully",
      data: { company: company },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", data: { company: null } });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const user = req.user?.employee;
    if (!user) {
      return res.status(401).json({ message: "Employee not found" });
    }
    if (user.role !== Role.OWNER) {
      return res.status(403).json({
        message: "You are not authorized to update this company",
      });
    }
    const { slug } = req.params;
    const {
      name,
      slug: newSlug,
      address,
      logo,
      phone,
      email,
      website,
    } = await updateCompanyValidation.parseAsync(req.body);
    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }
    if (newSlug && newSlug !== slug) {
      const companyWithSameSlug = await prisma.company.findUnique({
        where: { slug: newSlug },
      });
      if (companyWithSameSlug) {
        return res.status(400).json({
          message:
            "Company with this slug already exists, please use a different slug",
        });
      }
    }
    const company = await prisma.company.findUnique({
      where: { slug: slug },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (user.companyId && user.companyId !== company.id) {
      return res
        .status(400)
        .json({ message: "User is not authorized to update this company" });
    }
    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: {
        name: name ?? company.name,
        slug: newSlug ? newSlug : slug,
        address: address ?? company.address,
        logo: logo ?? company.logo,
        phone: phone ?? company.phone,
        email: email ?? company.email,
        website: website ?? company.website,
      },
    });

    return res.status(200).json({
      message: "Company updated successfully",
      data: { company: updatedCompany },
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
      .json({ message: "Internal server error", data: { company: null } });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const user = req.user?.employee;
    if (!user) {
      return res.status(401).json({ message: "Employee not found" });
    }
    if (user.role !== Role.OWNER) {
      return res.status(403).json({
        message: "You are not authorized to delete this company",
      });
    }
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }
    const company = await prisma.company.findUnique({
      where: { slug: slug },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    if (user.companyId && user.companyId !== company.id) {
      return res
        .status(400)
        .json({ message: "User is not authorized to delete this company" });
    }
    const employees = await prisma.employee.findMany({
      where: { companyId: company.id },
      select: { id: true },
    });

    await prisma.employee.updateMany({
      where: { companyId: company.id },
      data: { companyId: null },
    });
    await prisma.shift.deleteMany({
      where: { companyId: company.id },
    });
    await prisma.department.deleteMany({
      where: { companyId: company.id },
    });
    await prisma.company.delete({
      where: { id: company.id },
    });

    return res.status(200).json({
      message: "Company deleted successfully",
      data: { company: company },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", data: { company: null } });
  }
};