import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import { otpWorker } from "./utils/otp-worker.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await otpWorker.close();
  process.exit(0);
});