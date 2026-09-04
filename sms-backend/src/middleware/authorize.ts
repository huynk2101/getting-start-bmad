import type { Request, Response, NextFunction } from "express";

export function requireRole(
  ...roles: Array<"TEACHER" | "STUDENT">
) {
  if (roles.length === 0) {
    throw new Error("requireRole: at least one role must be specified");
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to access this resource",
        },
      });
      return;
    }

    next();
  };
}
