"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCompanies = exports.createCompany = void 0;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
const createCompany = async (req, res) => {
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
        const existingCompany = await prisma_1.prisma.company.findUnique({
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
        const company = await prisma_1.prisma.company.create({
            data: {
                name,
                slug,
            },
        });
        await prisma_1.prisma.employee.update({
            where: {
                id: req.user.id,
            },
            data: {
                companyId: company.id,
                role: client_1.Role.SUPER_ADMIN,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Company created successfully",
            company: company,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
exports.createCompany = createCompany;
const getUserCompanies = async (req, res) => {
    try {
        const user = req.user;
        const companies = await prisma_1.prisma.company.findMany({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
exports.getUserCompanies = getUserCompanies;
