"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const department_controller_1 = require("../controller/department.controller");
const departmentRouter = (0, express_1.Router)();
departmentRouter.post("/create", auth_middleware_1.authenticate, department_controller_1.createDepartment);
departmentRouter.get("/get-departments", auth_middleware_1.authenticate, department_controller_1.getDepartments);
exports.default = departmentRouter;
