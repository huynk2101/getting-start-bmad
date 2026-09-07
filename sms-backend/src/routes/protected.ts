import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";

export const protectedRouter = Router();

if (process.env.NODE_ENV !== "production") {
  /**
   * Demonstrator route for Teacher role
   */
  protectedRouter.get(
    "/protected/teacher-only",
    requireAuth,
    requireRole("TEACHER"),
    (_req, res) => {
      res.json({ data: { ok: true } });
    },
  );

  /**
   * Demonstrator route for Student role
   */
  protectedRouter.get(
    "/protected/student-only",
    requireAuth,
    requireRole("STUDENT"),
    (_req, res) => {
      res.json({ data: { ok: true } });
    },
  );
}
