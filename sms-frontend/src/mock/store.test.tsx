import { describe, it, expect } from "vitest";
import { renderHook, act, render, screen } from "@testing-library/react";
import { PropsWithChildren, type ReactNode } from "react";
import { DemoDataProvider, useStore } from "./store.js";

function wrapper({ children }: PropsWithChildren) {
  return <DemoDataProvider>{children}</DemoDataProvider>;
}

function renderStore() {
  return renderHook(() => useStore(), { wrapper });
}

describe("mock store", () => {
  it("starts in role-login with no role", () => {
    const { result } = renderStore();
    expect(result.current.role).toBeNull();
    expect(result.current.route.screen).toBe("role-login");
  });

  it("sets role to teacher and navigates to teacher dashboard", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.setRole("teacher");
    });
    expect(result.current.role).toBe("teacher");
    expect(result.current.route.screen).toBe("teacher-dashboard");
  });

  it("sets role to student and navigates to student dashboard", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.setRole("student");
    });
    expect(result.current.role).toBe("student");
    expect(result.current.route.screen).toBe("student-dashboard");
  });

  it("grades a student and marks roster entry as graded", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.gradeStudent("e1", "s2", 72);
    });
    const entry = result.current.roster.find(
      (r) => r.classId === "c1" && r.studentId === "s2"
    );
    expect(entry?.gradingStatus).toBe("graded");
    expect(entry?.score).toBe(72);
  });

  it("gradeStudent only affects the exam's class roster entry", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.gradeStudent("e1", "s2", 72);
    });
    const c1Entry = result.current.roster.find(
      (r) => r.classId === "c1" && r.studentId === "s2"
    );
    const c2Entry = result.current.roster.find(
      (r) => r.classId === "c2" && r.studentId === "s2"
    );
    expect(c1Entry?.gradingStatus).toBe("graded");
    expect(c1Entry?.score).toBe(72);
    // other class entry untouched
    expect(c2Entry?.gradingStatus).toBe("graded");
    expect(c2Entry?.score).toBe(88);
  });

  it("sets a student absent and clears score", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.setAbsent("e1", "s2", true);
    });
    const entry = result.current.roster.find(
      (r) => r.classId === "c1" && r.studentId === "s2"
    );
    expect(entry?.absent).toBe(true);
    expect(entry?.gradingStatus).toBe("absent");
    expect(entry?.score).toBeUndefined();
  });

  it("toggles absent off restoring pending", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.setAbsent("e1", "s4", false);
    });
    const entry = result.current.roster.find(
      (r) => r.classId === "c1" && r.studentId === "s4"
    );
    expect(entry?.absent).toBe(false);
    expect(entry?.gradingStatus).toBe("pending");
  });

  it("setAbsent only affects the exam's class roster entry", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.setAbsent("e1", "s2", true);
    });
    const c1Entry = result.current.roster.find(
      (r) => r.classId === "c1" && r.studentId === "s2"
    );
    const c2Entry = result.current.roster.find(
      (r) => r.classId === "c2" && r.studentId === "s2"
    );
    expect(c1Entry?.absent).toBe(true);
    expect(c1Entry?.gradingStatus).toBe("absent");
    expect(c2Entry?.absent).toBe(false);
    expect(c2Entry?.gradingStatus).toBe("graded");
  });

  it("saves an exam answer and marks question answered", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.saveExamAnswer("e1", "q1", 0);
    });
    const studentResult = result.current.results.find(
      (r) => r.examId === "e1" && r.studentId === "s1"
    );
    expect(studentResult?.answers["q1"]).toBe(0);
  });

  it("submits an exam and computes a score", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.saveExamAnswer("e1", "q1", 0);
      result.current.submitExam("e1");
    });
    const studentResult = result.current.results.find(
      (r) => r.examId === "e1" && r.studentId === "s1"
    );
    expect(studentResult?.submitted).toBe(true);
    expect(studentResult?.score).toBeTypeOf("number");
  });

  it("submits an exam with zero answers and records a zero score", () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      result.current.submitExam("e1");
    });
    const studentResult = result.current.results.find(
      (r) => r.examId === "e1" && r.studentId === "s1"
    );
    expect(studentResult?.submitted).toBe(true);
    expect(studentResult?.score).toBe(0);
  });
});
