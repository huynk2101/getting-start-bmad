declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      username: string;
      role: "TEACHER" | "STUDENT";
    };
  }
}
