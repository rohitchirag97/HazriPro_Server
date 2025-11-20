"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manualAttendance = exports.checkOutAttendance = exports.checkInAttendance = void 0;
const attendance_service_1 = require("../services/attendance.service");
const checkInAttendance = async (req, res) => {
    try {
        const { employeeId } = req.body;
        const data = await (0, attendance_service_1.checkIn)(employeeId, req.user.companyId);
        return res.status(200).json({
            success: true,
            message: "Attendance checked in successfully",
            data: data,
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
exports.checkInAttendance = checkInAttendance;
const checkOutAttendance = async (req, res) => {
    try {
        const { employeeId } = req.body;
        const data = await (0, attendance_service_1.checkOut)(employeeId, req.user.companyId);
        return res.status(200).json({
            success: true,
            message: "Attendance checked out successfully",
            data: data,
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
exports.checkOutAttendance = checkOutAttendance;
const manualAttendance = async (req, res) => {
    try {
        const { employeeId, status } = req.body;
        const data = await (0, attendance_service_1.manualAttendance)(employeeId, status);
        return res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            data: data,
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
exports.manualAttendance = manualAttendance;
