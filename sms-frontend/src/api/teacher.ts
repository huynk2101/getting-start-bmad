import { useQuery } from "@tanstack/react-query";
import type { TodayClass, DashboardResponse } from "sms-shared";

async function fetchTodayClasses(day: string): Promise<TodayClass[]> {
  const res = await fetch(`/api/teacher/dashboard?day=${encodeURIComponent(day)}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message = payload?.error?.message ?? "Failed to load today's classes";
    const err = new Error(message) as Error & { code?: string };
    err.code = payload?.error?.code;
    throw err;
  }

  const payload = (await res.json()) as DashboardResponse;
  return payload.data.classes;
}

/** Returns the current day of week in the Prisma Weekday enum format (e.g. "MONDAY") */
export function getTodayWeekday(): string {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
}

export function useTodayClasses() {
  const day = getTodayWeekday();
  return useQuery<TodayClass[], Error>({
    queryKey: ["todayClasses", day],
    queryFn: () => fetchTodayClasses(day),
    staleTime: 60_000,
  });
}

async function fetchClassDetail(classId: string): Promise<import("sms-shared").ClassDetailDTO> {
  const res = await fetch(`/api/teacher/classes/${encodeURIComponent(classId)}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message = payload?.error?.message ?? "Failed to load class details";
    const err = new Error(message) as Error & { code?: string };
    err.code = payload?.error?.code;
    throw err;
  }

  const payload = (await res.json()) as import("sms-shared").ClassDetailResponse;
  return payload.data.class;
}

export function useClassDetail(classId?: string) {
  return useQuery<import("sms-shared").ClassDetailDTO, Error>({
    queryKey: ["classDetail", classId],
    queryFn: () => fetchClassDetail(classId!),
    enabled: Boolean(classId),
    staleTime: 60_000,
  });
}

