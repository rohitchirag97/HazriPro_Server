"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployee = exports.getEmployeebyPhone = exports.getEmployeebyId = exports.getEmployees = exports.createEmployee = void 0;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
const createEmployee = async (req, res) => {
    try {
        const { fname, lname, phone, shiftId, departmentId } = req.body;
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
                message: "You are not authorized to create an employee",
            });
        }
        if (!fname || !phone) {
            return res.status(400).json({
                success: false,
                message: "Fname and phone are required",
            });
        }
        const existingEmployee = await prisma_1.prisma.employee.findUnique({
            where: { phone },
        });
        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: "Employee already exists",
            });
        }
        const employee = await prisma_1.prisma.employee.create({
            data: { fname, lname, phone, shiftId, departmentId, companyId },
        });
        return res.status(200).json({
            success: true,
            message: "Employee created successfully",
            employee: employee,
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
exports.createEmployee = createEmployee;
const getEmployees = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company ID is required",
            });
        }
        const employees = await prisma_1.prisma.employee.findMany({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
exports.getEmployees = getEmployees;
const getEmployeebyId = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company ID is required",
            });
        }
        const employee = await prisma_1.prisma.employee.findUnique({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
exports.getEmployeebyId = getEmployeebyId;
const getEmployeebyPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        const companyId = req.user.companyId;
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company ID is required",
            });
        }
        const employee = await prisma_1.prisma.employee.findUnique({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
exports.getEmployeebyPhone = getEmployeebyPhone;
const updateEmployee = async (req, res) => {
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
        if (req.user.role !== client_1.Role.SUPER_ADMIN) {
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
        const employee = await prisma_1.prisma.employee.update({
            where: { id, companyId },
            data: { fname, lname, phone, shiftId, departmentId },
        });
        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee: employee,
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
exports.updateEmployee = updateEmployee;
