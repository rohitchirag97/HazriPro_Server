import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { addDays, differenceInMinutes, isAfter, isBefore, set } from "date-fns";

const TZ = process.env.TZ || "Asia/Kolkata";

export function startOfWorkDate(date: Date, tz = TZ): Date {
  // Normalize the "work date" to local midnight for uniqueness key
  const local = toZonedTime(date, tz);
  const localMidnight = set(local, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  return fromZonedTime(localMidnight, tz);
}

export function parseShiftBoundaries(workDate: Date, startHHmm: string, endHHmm: string, tz = TZ) {
  const [sh, sm] = startHHmm.split(":").map(Number);
  const [eh, em] = endHHmm.split(":").map(Number);

  const local = toZonedTime(workDate, tz); // e.g., 2025-10-13T00:00 local
  const startLocal = set(local, { hours: sh, minutes: sm, seconds: 0, milliseconds: 0 });

  // If end < start => overnight (ends next day)
  let endLocal = set(local, { hours: eh, minutes: em, seconds: 0, milliseconds: 0 });
  if (isBefore(endLocal, startLocal) || +endLocal === +startLocal) {
    endLocal = addDays(endLocal, 1);
  }

  // Convert back to UTC for storage/comparison
  const startUtc = fromZonedTime(startLocal, tz);
  const endUtc = fromZonedTime(endLocal, tz);

  const shiftMinutes = differenceInMinutes(endUtc, startUtc);
  return { startUtc, endUtc, shiftMinutes };
}

export function minutesBetween(a: Date, b: Date) {
  return Math.abs(differenceInMinutes(a, b));
}

export function clampLateEarly(inTime: Date, outTime: Date, shiftStartUtc: Date, shiftEndUtc: Date) {
  const late = isAfter(inTime, shiftStartUtc) ? minutesBetween(inTime, shiftStartUtc) : 0;
  const early = isBefore(outTime, shiftEndUtc) ? minutesBetween(outTime, shiftEndUtc) : 0;
  return { lateMinutes: late, earlyMinutes: early };
}