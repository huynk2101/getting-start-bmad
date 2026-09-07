import { Router } from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import type { TodayClass } from "sms-shared";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export const teacherRouter = Router();

const VALID_WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

type Weekday = (typeof VALID_WEEKDAYS)[number];

/**
 * GET /api/teacher/dashboard?day=MONDAY
 * Returns classes scheduled for the given day-of-week for the authenticated teacher.
 */
teacherRouter.get("/dashboard", async (req, res) => {
  const { day } = req.query;

  if (!day || typeof day !== "string" || !VALID_WEEKDAYS.includes(day as Weekday)) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: `Invalid or missing 'day' query parameter. Must be one of: ${VALID_WEEKDAYS.join(", ")}`,
      },
    });
    return;
  }

  const teacherId = req.user!.userId;

  try {
    const classes = await prisma.class.findMany({
      where: {
        teacherId,
        schedules: {
          some: { dayOfWeek: day as Weekday },
        },
      },
      include: {
        schedules: {
          where: { dayOfWeek: day as Weekday },
        },
        _count: {
          select: { students: true },
        },
      },
    });

    const todayClasses: TodayClass[] = [];
    for (const cls of classes) {
      for (const schedule of cls.schedules) {
        todayClasses.push({
          id: cls.id,
          name: cls.name,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          studentCount: cls._count.students,
        });
      }
    }

    todayClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json({ data: { classes: todayClasses } });
  } catch (err) {
    console.error("GET /api/teacher/dashboard error:", err);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  }
});
