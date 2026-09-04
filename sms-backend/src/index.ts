import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { healthRouter } from "./routes/health.js";
import { authRouter } from "./routes/auth.js";
import { protectedRouter } from "./routes/protected.js";

if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL environment variable is not set.");
  console.error("Ensure your .env file is loaded or pass DATABASE_URL explicitly.");
  process.exit(1);
}

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
if (Number.isNaN(port) || port < 1 || port > 65535) {
  console.error(`FATAL: PORT environment variable is invalid: "${process.env.PORT}". Must be an integer between 1 and 65535.`);
  process.exit(1);
}

app.use(express.json());
app.use(cookieParser());
app.use("/api", healthRouter);
app.use("/api", authRouter);
app.use("/api", protectedRouter);

app.listen(port, () => {
  console.log(`SMS Backend listening on port ${port}`);
}).on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`FATAL: Port ${port} is already in use. Free the port or set PORT to a different value.`);
  } else {
    console.error("FATAL: Server failed to start:", err.message);
  }
  process.exit(1);
});
