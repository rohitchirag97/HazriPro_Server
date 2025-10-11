import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import companyRouter from "./routes/company.route";
import departmentRouter from "./routes/department.route";
import shiftRouter from "./routes/shift.route";
import employeeRouter from "./routes/employee.route";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/shift", shiftRouter);
app.use("/api/v1/employee", employeeRouter);

app.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode`
  );
});

export default app;
