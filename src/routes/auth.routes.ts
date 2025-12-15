import { Router } from "express";
import { login, me, registerUser, verifyEmailOTP } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/verify-email", verifyEmailOTP);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, me);

export default authRouter;