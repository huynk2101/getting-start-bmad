import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";

if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL environment variable is not set.");
  console.error("Ensure your .env file is loaded or pass DATABASE_URL explicitly.");
  process.exit(1);
}

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
if (Number.isNaN(port) || port <= 0) {
  console.error(`FATAL: PORT environment variable is invalid: "${process.env.PORT}". Must be a positive integer.`);
  process.exit(1);
}

app.use(express.json());
app.use(cookieParser());
app.use("/api", healthRouter);
app.use("/api", authRouter);

app.listen(port, () => {
  console.log(`SMS Backend listening on port ${port}`);
});
