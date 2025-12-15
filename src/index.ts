import express from "express";
import "dotenv/config";
import cors from "cors";
import { otpWorker } from "./utils/otp-worker.js";
import authRouter from "./routes/auth.routes.js";
import companyRouter from "./routes/company.routes.js";
import shiftsRouter from "./routes/shifts.routes.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/shifts", shiftsRouter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  process.exit(0);
  await otpWorker.close();
});
