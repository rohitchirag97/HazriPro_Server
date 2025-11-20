import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createEmployee,
  getEmployeebyId,
  getEmployeebyPhone,
  getEmployees,
  indexEmployeeFace,
  searchfacebyimage,
  updateEmployee,
} from "../controller/employee.controller";
import multer from "multer";

const employeeRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

employeeRouter.post("/create", authenticate, createEmployee);
employeeRouter.get("/get-employees", authenticate, getEmployees);
employeeRouter.get("/get-employee/:id", authenticate, getEmployeebyId);
employeeRouter.get(
  "/get-employee-by-phone/:phone",
  authenticate,
  getEmployeebyPhone
);
employeeRouter.put("/update/:id", authenticate, updateEmployee);
employeeRouter.post(
  "/index-employee-face",
  authenticate,
  upload.single("image"),
  indexEmployeeFace
);
employeeRouter.post(
  "/search-employee-face",
  authenticate,
  upload.single("image"),
  searchfacebyimage
);

export default employeeRouter;