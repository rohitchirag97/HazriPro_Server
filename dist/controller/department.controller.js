"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartments = exports.createDepartment = void 0;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        const companyId = req.user.companyId;
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company ID is required",
            });
        }
        if (req.user.role !== client_1.Role.SUPER_ADMIN) {
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
        const department = await prisma_1.prisma.department.create({
            data: { name, companyId: companyId },
        });
        return res.status(200).json({
            success: true,
            message: "Department created successfully",
            department: department,
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
exports.createDepartment = createDepartment;
const getDepartments = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company ID is required",
            });
        }
        const departments = await prisma_1.prisma.department.findMany({
            where: { companyId: companyId },
        });
        return res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            departments: departments,
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
exports.getDepartments = getDepartments;
