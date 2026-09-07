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

/**
 * GET /api/teacher/classes/:classId
 * Returns class details, schedules, and student roster for the authenticated teacher.
 */
teacherRouter.get("/classes/:classId", async (req, res) => {
  const { classId } = req.params;
  const teacherId = req.user!.userId;

  try {
    const cls = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId,
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        schedules: true,
        students: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!cls) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Class not found or access denied" },
      });
      return;
    }

    const classDetail = {
      id: cls.id,
      name: cls.name,
      teacherName: `${cls.teacher.firstName} ${cls.teacher.lastName}`,
      schedules: cls.schedules.map((s) => ({
        id: s.id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
      studentCount: cls.students.length,
      students: cls.students.map((s) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: `${s.username}@school.test`,
        studentId: `STU-${s.id.slice(0, 6).toUpperCase()}`,
      })),
    };

    res.json({ data: { class: classDetail } });
  } catch (err) {
    console.error(`GET /api/teacher/classes/${classId} error:`, err);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  }
});

