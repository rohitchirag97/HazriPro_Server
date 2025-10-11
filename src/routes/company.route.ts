import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createCompany, getUserCompanies } from "../controller/company.controller";

const companyRouter = Router();

companyRouter.post("/create", authenticate, createCompany);
companyRouter.get("/get-companies", authenticate, getUserCompanies);

export default companyRouter;