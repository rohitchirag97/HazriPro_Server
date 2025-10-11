import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createEmployee,
  getEmployeebyId,
  getEmployeebyPhone,
  getEmployees,
  updateEmployee,
} from "../controller/employee.controller";

const employeeRouter = Router();

employeeRouter.post("/create", authenticate, createEmployee);
employeeRouter.get("/get-employees", authenticate, getEmployees);
employeeRouter.get("/get-employee/:id", authenticate, getEmployeebyId);
employeeRouter.get("/get-employee-by-phone/:phone", authenticate, getEmployeebyPhone);
employeeRouter.put("/update/:id", authenticate, updateEmployee);


export default employeeRouter;
