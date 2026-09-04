import type { Request, Response, NextFunction } from "express";

export function requireRole(
  ...roles: ["TEACHER" | "STUDENT", ...Array<"TEACHER" | "STUDENT">]
): (req: Request, res: Response, next: NextFunction) => void {

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
