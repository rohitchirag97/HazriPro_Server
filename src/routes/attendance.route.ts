import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  checkInAttendance,
  checkOutAttendance,
  manualAttendance,
} from "../controller/attendance.controller";

const attendanceRouter = Router();

attendanceRouter.post("/check-in", authenticate, checkInAttendance);
attendanceRouter.post("/check-out", authenticate, checkOutAttendance);
attendanceRouter.post("/manual", authenticate, manualAttendance);

export default attendanceRouter;
