"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIn = checkIn;
exports.checkOut = checkOut;
exports.manualAttendance = manualAttendance;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
const time_1 = require("../config/time");
const { differenceInMinutes } = require("date-fns");
async function checkIn(employeeId, companyId, now = new Date()) {
    const employee = await prisma_1.prisma.employee.findUnique({
        where: { id: employeeId, companyId },
        include: {
            shift: true,
            company: true,
        },
    });
    if (!employee) {
        throw new Error("Employee not found");
    }
    if (!employee.shift) {
        throw new Error("Employee has no shift");
    }
    if (!companyId) {
        throw new Error("Company ID is required");
    }
    const workDate = (0, time_1.startOfWorkDate)(now);
    // Check if attendance record already exists
    const existingRecord = await prisma_1.prisma.attendance.findFirst({
        where: {
            employeeId,
            date: workDate,
        },
    });
    if (existingRecord) {
        // Update existing record
        return prisma_1.prisma.attendance.update({
            where: { id: existingRecord.id },
            data: {
                inTime: now,
                status: client_1.AttendanceStatus.PRESENT,
            },
        });
    }
    else {
        // Create new record
        return prisma_1.prisma.attendance.create({
            data: {
                employeeId,
                companyId,
                date: workDate,
                inTime: now,
                status: client_1.AttendanceStatus.PRESENT,
            },
        });
    }
}
async function checkOut(employeeId, companyId, now = new Date()) {
    const employee = await prisma_1.prisma.employee.findUnique({
        where: { id: employeeId },
        include: {
            shift: true,
            company: true,
        },
    });
    if (!employee) {
        throw new Error("Employee not found");
    }
    if (!employee.shift) {
        throw new Error("Employee has no shift");
    }
    const workDate = (0, time_1.startOfWorkDate)(now);
    const att = await prisma_1.prisma.attendance.findFirst({
        where: {
            employeeId,
            date: workDate,
        },
    });
    if (!att) {
        throw new Error("No check in found today");
    }
    if (!att.inTime) {
        throw new Error("No check in found today");
    }
    if (att.outTime) {
        return att;
    }
    const { startUtc, endUtc, shiftMinutes } = (0, time_1.parseShiftBoundaries)(workDate, employee.shift.startTime, employee.shift.endTime);
    const workMinutes = Math.max(0, differenceInMinutes(now, att.inTime));
    const { lateMinutes, earlyMinutes } = (0, time_1.clampLateEarly)(att.inTime, now, startUtc, endUtc);
    let status = client_1.AttendanceStatus.PRESENT;
    if (workMinutes < 180) {
        status = client_1.AttendanceStatus.ABSENT;
    }
    if (workMinutes > 180 && workMinutes > shiftMinutes) {
        status = client_1.AttendanceStatus.HALF_DAY;
    }
    const overTime = Math.max(0, workMinutes - shiftMinutes);
    const updated = await prisma_1.prisma.attendance.update({
        where: { id: att.id },
        data: {
            outTime: now,
            status,
            overtimeHours: +(overTime / 60).toFixed(2),
            lateHours: +(lateMinutes / 60).toFixed(2),
            earlyHours: +(earlyMinutes / 60).toFixed(2),
        },
    });
    return updated;
}
async function manualAttendance(employeeId, status) {
    const employee = await prisma_1.prisma.employee.findUnique({
        where: { id: employeeId },
        include: {
            shift: true,
            company: true,
        },
    });
    if (!employee) {
        throw new Error("Employee not found");
    }
    const attendance = await prisma_1.prisma.attendance.create({
        data: {
            employeeId,
            companyId: employee.companyId,
            date: new Date(),
            inTime: employee.shift?.startTime
                ? new Date(employee.shift.startTime)
                : null,
            outTime: employee.shift?.endTime
                ? new Date(employee.shift.endTime)
                : null,
            status,
            overtimeHours: 0,
            lateHours: 0,
            earlyHours: 0,
        },
    });
    return attendance;
}
