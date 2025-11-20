import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createCompany, getCompanybyslug, getUserCompanies } from "../controller/company.controller";

const companyRouter = Router();

companyRouter.post("/create", authenticate, createCompany);
companyRouter.get("/get-companies", authenticate, getUserCompanies);
companyRouter.get("/get-company-by-slug/:slug", authenticate, getCompanybyslug);

export default companyRouter;