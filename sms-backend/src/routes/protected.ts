import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";

export const protectedRouter = Router();

protectedRouter.get(
  "/protected/teacher-only",
  requireAuth,
  requireRole("TEACHER"),
  (_req, res) => {
    res.json({ data: { ok: true } });
  },
);

protectedRouter.get(
  "/protected/student-only",
  requireAuth,
  requireRole("STUDENT"),
  (_req, res) => {
    res.json({ data: { ok: true } });
  },
);
