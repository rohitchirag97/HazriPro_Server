import { Router } from "express";
import { requestOTP, verifyOTP } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/request-otp", requestOTP);
authRouter.post("/verify-otp", verifyOTP);

export default authRouter;