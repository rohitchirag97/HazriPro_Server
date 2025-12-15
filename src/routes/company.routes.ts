import { Router } from "express";
import {
  createCompany,
  getCompany,
  getCompanyBySlug,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const companyRouter = Router();

companyRouter.post("/create", authenticate, createCompany);
companyRouter.get("/get", authenticate, getCompany);
companyRouter.get("/get-by-slug/:slug", authenticate, getCompanyBySlug);
companyRouter.put("/update/:slug", authenticate, updateCompany);
companyRouter.delete("/delete/:slug", authenticate, deleteCompany);

export default companyRouter;
