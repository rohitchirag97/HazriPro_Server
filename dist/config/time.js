"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfWorkDate = startOfWorkDate;
exports.parseShiftBoundaries = parseShiftBoundaries;
exports.minutesBetween = minutesBetween;
exports.clampLateEarly = clampLateEarly;
const date_fns_tz_1 = require("date-fns-tz");
const date_fns_1 = require("date-fns");
const TZ = process.env.TZ || "Asia/Kolkata";
function startOfWorkDate(date, tz = TZ) {
    // Normalize the "work date" to local midnight for uniqueness key
    const local = (0, date_fns_tz_1.toZonedTime)(date, tz);
    const localMidnight = (0, date_fns_1.set)(local, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    return (0, date_fns_tz_1.fromZonedTime)(localMidnight, tz);
}
function parseShiftBoundaries(workDate, startHHmm, endHHmm, tz = TZ) {
    const [sh, sm] = startHHmm.split(":").map(Number);
    const [eh, em] = endHHmm.split(":").map(Number);
    const local = (0, date_fns_tz_1.toZonedTime)(workDate, tz); // e.g., 2025-10-13T00:00 local
    const startLocal = (0, date_fns_1.set)(local, { hours: sh, minutes: sm, seconds: 0, milliseconds: 0 });
    // If end < start => overnight (ends next day)
    let endLocal = (0, date_fns_1.set)(local, { hours: eh, minutes: em, seconds: 0, milliseconds: 0 });
    if ((0, date_fns_1.isBefore)(endLocal, startLocal) || +endLocal === +startLocal) {
        endLocal = (0, date_fns_1.addDays)(endLocal, 1);
    }
    // Convert back to UTC for storage/comparison
    const startUtc = (0, date_fns_tz_1.fromZonedTime)(startLocal, tz);
    const endUtc = (0, date_fns_tz_1.fromZonedTime)(endLocal, tz);
    const shiftMinutes = (0, date_fns_1.differenceInMinutes)(endUtc, startUtc);
    return { startUtc, endUtc, shiftMinutes };
}
function minutesBetween(a, b) {
    return Math.abs((0, date_fns_1.differenceInMinutes)(a, b));
}
function clampLateEarly(inTime, outTime, shiftStartUtc, shiftEndUtc) {
    const late = (0, date_fns_1.isAfter)(inTime, shiftStartUtc) ? minutesBetween(inTime, shiftStartUtc) : 0;
    const early = (0, date_fns_1.isBefore)(outTime, shiftEndUtc) ? minutesBetween(outTime, shiftEndUtc) : 0;
    return { lateMinutes: late, earlyMinutes: early };
}
