import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createDepartment, getDepartments } from "../controller/department.controller";

const departmentRouter = Router();

departmentRouter.post("/create", authenticate, createDepartment);
departmentRouter.get("/get-departments", authenticate, getDepartments);

export default departmentRouter;