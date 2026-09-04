import { Router } from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import type { HealthCheckResponse } from "sms-shared";

export const healthRouter = Router();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

healthRouter.get("/health", async (_req, res) => {
  let dbStatus: "connected" | "disconnected" = "disconnected";
  try {
    const query = prisma.$queryRaw`SELECT 1`;
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB probe timed out")), 5000),
    );
    await Promise.race([query, timeout]);
    dbStatus = "connected";
  } catch (err) {
    console.error("[health] DB probe failed:", err);
  }

  const body: HealthCheckResponse = {
    status: dbStatus === "connected" ? "healthy" : "unhealthy",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  };

  const statusCode = body.status === "healthy" ? 200 : 503;
  res.status(statusCode).json(body);
});
