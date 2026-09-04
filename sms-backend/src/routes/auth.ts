import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { JWT_SECRET } from "../middleware/auth.js";
import type { LoginRequest, LoginResponse } from "sms-shared";

export const authRouter = Router();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const isSecure = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: isSecure,
  path: "/",
};

authRouter.post("/auth/login", async (req, res) => {
  const { username, password } = (req.body ?? {}) as Partial<LoginRequest>;

  if (!username || !password) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Username and password are required",
      },
    });
    return;
  }

  try {
    const trimmedUsername = username.trim();
    const user = await prisma.user.findUnique({ where: { username: trimmedUsername } });
    if (!user) {
      res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid username or password",
        },
      });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid username or password",
        },
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("sms-token", token, COOKIE_OPTIONS);

    const body: LoginResponse = {
      data: {
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    };

    res.json(body);
  } catch (err) {
    console.error("[auth/login] Unexpected error:", err);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    });
  }
});

authRouter.get("/auth/me", async (req, res) => {
  const token = req.cookies?.["sms-token"];
  if (!token) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!decoded.userId) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    res.json({
      data: {
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.clearCookie("sms-token", COOKIE_OPTIONS);
      res.status(401).json({
        error: { code: "TOKEN_EXPIRED", message: "Session expired" },
      });
      return;
    }
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
  }
});

authRouter.post("/auth/logout", (_req, res) => {
  res.clearCookie("sms-token", COOKIE_OPTIONS);
  res.json({ data: {} });
});
