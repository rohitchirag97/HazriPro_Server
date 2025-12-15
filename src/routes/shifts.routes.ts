import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createShift } from "../controllers/shift.controller.js";

const shiftsRouter = Router();

shiftsRouter.post("/create", authenticate, createShift);

export default shiftsRouter;