import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createShift, getShifts } from "../controller/shift.controller";

const shiftRouter = Router();

shiftRouter.post("/create", authenticate, createShift);
shiftRouter.get("/get-shifts", authenticate, getShifts);

export default shiftRouter;
