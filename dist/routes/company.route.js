"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const company_controller_1 = require("../controller/company.controller");
const companyRouter = (0, express_1.Router)();
companyRouter.post("/create", auth_middleware_1.authenticate, company_controller_1.createCompany);
companyRouter.get("/get-companies", auth_middleware_1.authenticate, company_controller_1.getUserCompanies);
exports.default = companyRouter;
