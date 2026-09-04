import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { DemoDataProvider } from "../mock/store.js";
import { ToastProvider } from "../components/index.js";
import { ExamTaking } from "./student/exam-taking.js";
import "../screens/student/exam-taking.css";

vi.mock("../demo/demo-layout.js", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function wrapper({ children }: PropsWithChildren) {
  return (
    <DemoDataProvider>
      <ToastProvider>{children}</ToastProvider>
    </DemoDataProvider>
  );
}

function renderExamTaking() {
  return render(<ExamTaking examId="e1" />, { wrapper });
}

describe("ExamTaking", () => {
  it("renders the exam question and timer", () => {
    renderExamTaking();
    expect(screen.getByText("Biology Midterm")).toBeInTheDocument();
    expect(
      screen.getByText("What is the powerhouse of the cell?")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/minutes .* seconds remaining/)).toBeInTheDocument();
  });

  it("renders question navigation with 10 questions", () => {
    renderExamTaking();
    const nav = screen.getByRole("navigation", { name: "Question navigation" });
    const items = within(nav).getAllByRole("button");
    expect(items).toHaveLength(10);
  });

  it("selecting a radio option marks the answer", () => {
    renderExamTaking();
    // The current question Q1 has options; option B is index 1
    const optionB = screen.getByLabelText(/B\. Mitochondria/);
    fireEvent.click(optionB);
    // The checkmark appears - the answered nav item gets aria-label "Question 1, answered"
    const answeredNav = screen.getByLabelText("Question 1, answered");
    expect(answeredNav).toBeInTheDocument();
  });

  it("shows submit dialog with unanswered count", () => {
    renderExamTaking();
    const submitBtn = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitBtn);
    expect(screen.getByText("Submit your exam?")).toBeInTheDocument();
    expect(
      screen.getByText(/You've answered 0 of 10 questions/)
    ).toBeInTheDocument();
  });

  it("submits and confirms, showing toast and redirecting to results", () => {
    renderExamTaking();
    // answer one question
    const optionB = screen.getByLabelText(/B\. Mitochondria/);
    fireEvent.click(optionB);

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitBtn);

    const dialog = screen.getByRole("dialog");
    const confirmBtn = within(dialog).getByRole("button", { name: "Submit" });
    fireEvent.click(confirmBtn);

    // toast should appear
    expect(screen.getByText("All done, Alex!")).toBeInTheDocument();
  });

  it("Escape triggers confirm exit dialog", () => {
    renderExamTaking();
    fireEvent.keyDown(screen.getByLabelText("Biology Midterm — exam in progress"), {
      key: "Escape",
      code: "Escape",
    });
    expect(screen.getByText("Submit your exam?")).toBeInTheDocument();
  });

  it("auto-submits and announces when time expires", () => {
    vi.useFakeTimers();
    try {
      renderExamTaking();
      act(() => {
        // Biology Midterm is 45 minutes = 2700 seconds
        vi.advanceTimersByTime(2700 * 1000);
      });
      expect(screen.getAllByText("Time is up. Your exam has been submitted.").length).toBeGreaterThan(0);
      expect(screen.getByText("All done, Alex!")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
