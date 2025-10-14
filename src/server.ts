import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import companyRouter from "./routes/company.route";
import departmentRouter from "./routes/department.route";
import shiftRouter from "./routes/shift.route";
import employeeRouter from "./routes/employee.route";
import attendanceRouter from "./routes/attendance.route";
import healthRouter from "./routes/health.route";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 8000;

// Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/shift", shiftRouter);
app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/attendance", attendanceRouter);

app.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode`
  );
});

export default app;
