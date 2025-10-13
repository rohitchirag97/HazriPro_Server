import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AttendanceStatus } from "@prisma/client";
import {
  startOfWorkDate,
  parseShiftBoundaries,
  minutesBetween,
  clampLateEarly,
} from "../config/time";
import { set } from "date-fns";
const { differenceInMinutes } = require("date-fns");

export async function checkIn(
  employeeId: string,
  companyId: string,
  now = new Date()
) {
  const employee = await prisma.employee.findUnique({
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
  const workDate = startOfWorkDate(now);

  // Check if attendance record already exists
  const existingRecord = await prisma.attendance.findFirst({
    where: {
      employeeId,
      date: workDate,
    },
  });

  if (existingRecord) {
    // Update existing record
    return prisma.attendance.update({
      where: { id: existingRecord.id },
      data: {
        inTime: now,
        status: AttendanceStatus.PRESENT,
      },
    });
  } else {
    // Create new record
    return prisma.attendance.create({
      data: {
        employeeId,
        companyId,
        date: workDate,
        inTime: now,
        status: AttendanceStatus.PRESENT,
      },
    });
  }
}

export async function checkOut(
  employeeId: string,
  companyId: string,
  now = new Date()
) {
  const employee = await prisma.employee.findUnique({
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

  const workDate = startOfWorkDate(now);

  const att = await prisma.attendance.findFirst({
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
  const { startUtc, endUtc, shiftMinutes } = parseShiftBoundaries(
    workDate,
    employee.shift.startTime,
    employee.shift.endTime
  );

  const workMinutes = Math.max(0, differenceInMinutes(now, att.inTime));

  const { lateMinutes, earlyMinutes } = clampLateEarly(
    att.inTime,
    now,
    startUtc,
    endUtc
  );

  let status: AttendanceStatus = AttendanceStatus.PRESENT;
  if (workMinutes < 180) {
    status = AttendanceStatus.ABSENT;
  }
  if (workMinutes > 180 && workMinutes > shiftMinutes) {
    status = AttendanceStatus.HALF_DAY;
  }
  const overTime = Math.max(0, workMinutes - shiftMinutes);

  const updated = await prisma.attendance.update({
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

export async function manualAttendance(
  employeeId: string,
  status: AttendanceStatus
) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      shift: true,
      company: true,
    },
  });
  if (!employee) {
    throw new Error("Employee not found");
  }
  const attendance = await prisma.attendance.create({
    data: {
      employeeId,
      companyId: employee.companyId!,
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
