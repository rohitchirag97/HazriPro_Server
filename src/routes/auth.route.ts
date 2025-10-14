import { Router } from "express";
import { getUser, sendOTP, verifyOTP, logout } from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, getUser);

export default authRouter;
