import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — cannot seed");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const TEACHER = {
  username: "teacher@school.test",
  password: "change-me-123",
  firstName: "Jordan",
  lastName: "Lee",
};

const CLASS = {
  slug: "biology-midterm",
  name: "Biology Midterm Prep",
};

const SCHEDULE = {
  dayOfWeek: "MONDAY",
  startTime: "09:00",
  endTime: "10:00",
};

const STUDENTS = [
  { username: "alex.rivera", firstName: "Alex", lastName: "Rivera" },
  { username: "sara.chen", firstName: "Sara", lastName: "Chen" },
];

async function main() {
  const passwordHash = await bcrypt.hash(TEACHER.password, 10);

  const summary = await prisma.$transaction(async (tx) => {
    const teacher = await tx.user.upsert({
      where: { username: TEACHER.username },
      update: {
        passwordHash,
        firstName: TEACHER.firstName,
        lastName: TEACHER.lastName,
        role: "TEACHER",
      },
      create: {
        username: TEACHER.username,
        passwordHash,
        firstName: TEACHER.firstName,
        lastName: TEACHER.lastName,
        role: "TEACHER",
      },
    });

    const students = [];
    for (const s of STUDENTS) {
      // Each account hashes the same plaintext independently so the stored
      // hash strings are not identical across users.
      const studentHash = await bcrypt.hash(TEACHER.password, 10);
      const student = await tx.user.upsert({
        where: { username: s.username },
        update: {
          passwordHash: studentHash,
          firstName: s.firstName,
          lastName: s.lastName,
          role: "STUDENT",
        },
        create: {
          username: s.username,
          passwordHash: studentHash,
          firstName: s.firstName,
          lastName: s.lastName,
          role: "STUDENT",
        },
      });
      students.push(student);
    }

    const cls = await tx.class.upsert({
      where: { slug: CLASS.slug },
      update: { name: CLASS.name, teacherId: teacher.id },
      create: { slug: CLASS.slug, name: CLASS.name, teacherId: teacher.id },
    });

    const existing = await tx.schedule.findFirst({
      where: { classId: cls.id, dayOfWeek: SCHEDULE.dayOfWeek },
    });
    if (!existing) {
      await tx.schedule.create({
        data: {
          classId: cls.id,
          dayOfWeek: SCHEDULE.dayOfWeek,
          startTime: SCHEDULE.startTime,
          endTime: SCHEDULE.endTime,
        },
      });
    }

    await tx.class.update({
      where: { id: cls.id },
      data: {
        students: { set: students.map((s) => ({ id: s.id })) },
      },
    });

    const enrolled = await tx.class.findUniqueOrThrow({
      where: { id: cls.id },
      include: { students: true, schedules: true },
    });

    return {
      teacher: teacher.username,
      students: enrolled.students.map((s) => s.username),
      schedules: enrolled.schedules.length,
      classSlug: enrolled.slug,
    };
  });

  console.log("[seed] Complete:");
  console.log(`  teacher:   ${summary.teacher}`);
  console.log(`  class:     ${summary.classSlug}`);
  console.log(`  schedules: ${summary.schedules}`);
  console.log(`  students:  ${summary.students.join(", ")}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("[seed] Failed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
