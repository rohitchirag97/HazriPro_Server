import { Router } from "express";
import { me, requestOTP, verifyOTP } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/request-otp", requestOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.get("/me", authenticate, me);

export default authRouter;