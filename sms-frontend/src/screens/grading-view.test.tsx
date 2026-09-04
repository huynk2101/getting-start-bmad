import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { DemoDataProvider } from "../mock/store.js";
import { ToastProvider } from "../components/index.js";
import { GradingView } from "./teacher/grading-view.js";
import "../screens/teacher/grading-view.css";

function wrapper({ children }: PropsWithChildren) {
  return (
    <DemoDataProvider>
      <ToastProvider>{children}</ToastProvider>
    </DemoDataProvider>
  );
}

function renderGradingView() {
  return render(<GradingView examId="e1" />, { wrapper });
}

describe("GradingView", () => {
  it("shows biology midterm grading heading", () => {
    renderGradingView();
    expect(screen.getByText("Biology Midterm — Grading")).toBeInTheDocument();
  });

  it("shows the pending rows with inline score inputs", () => {
    renderGradingView();
    expect(screen.getByText("Morgan Lee")).toBeInTheDocument();
    // Morgan Lee is pending
  });

  it("shows Alex Rivera as already graded with a score", () => {
    renderGradingView();
    const cell = screen.getByText("Alex Rivera");
    expect(cell).toBeInTheDocument();
    expect(screen.getByText("85 / 100")).toBeInTheDocument();
  });

  it("finalize button is disabled until all rows graded", () => {
    renderGradingView();
    const finalize = screen.getByRole("button", { name: "Finalize Grades" });
    expect(finalize).toBeDisabled();
  });

  it("enables finalize when all rows are graded or absent", async () => {
    const { rerender } = renderGradingView();
    // Candidate 1: select all pending rows and grade them
    const pendingStates = [
      { studentId: "s2", name: "Morgan Lee", score: "72" },
      { studentId: "s3", name: "Jordan Kim", score: "81" },
      { studentId: "s5", name: "Casey Chen", score: "88" },
    ];

    for (const st of pendingStates) {
      const scoreInputs = screen.getAllByPlaceholderText("__");
      // Morgan, Jordan, Casey are pending. Taylor is absent (disabled).
      const rowEl = screen.getByText(st.name).closest("tr")!;
      const input = within(rowEl).getByPlaceholderText("__");
      fireEvent.change(input, { target: { value: st.score } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    }

    const finalize = screen.getByRole("button", { name: "Finalize Grades" });
    expect(finalize).toBeEnabled();
  });

  it("opens the finalize confirm dialog and finalizes grades", () => {
    renderGradingView();
    // Grade all pending first to enable finalize
    const pendingStates = [
      { name: "Morgan Lee", score: "72" },
      { name: "Jordan Kim", score: "81" },
      { name: "Casey Chen", score: "88" },
    ];

    for (const st of pendingStates) {
      const rowEl = screen.getByText(st.name).closest("tr")!;
      const input = within(rowEl).getByPlaceholderText("__");
      fireEvent.change(input, { target: { value: st.score } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    }

    const finalize = screen.getByRole("button", { name: "Finalize Grades" });
    fireEvent.click(finalize);

    expect(
      screen.getByText("Finalize grades for Biology Midterm?")
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    fireEvent.click(confirmButton);
  });

  it("rejects non-numeric score with inline error", () => {
    renderGradingView();
    const rowEl = screen.getByText("Morgan Lee").closest("tr")!;
    const input = within(rowEl).getByPlaceholderText("__");
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Must be a number")).toBeInTheDocument();
  });

  it("rejects out-of-range score with inline error", () => {
    renderGradingView();
    const rowEl = screen.getByText("Morgan Lee").closest("tr")!;
    const input = within(rowEl).getByPlaceholderText("__");
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Score must be 0–100")).toBeInTheDocument();
  });

  it("rejects decimal score with inline error", () => {
    renderGradingView();
    const rowEl = screen.getByText("Morgan Lee").closest("tr")!;
    const input = within(rowEl).getByPlaceholderText("__");
    fireEvent.change(input, { target: { value: "85.7" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Must be a number")).toBeInTheDocument();
  });

  it("rejects alphanumeric score like 85abc with inline error", () => {
    renderGradingView();
    const rowEl = screen.getByText("Morgan Lee").closest("tr")!;
    const input = within(rowEl).getByPlaceholderText("__");
    fireEvent.change(input, { target: { value: "85abc" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Must be a number")).toBeInTheDocument();
  });

  it("shows a toast when a grade is saved", () => {
    renderGradingView();
    const rowEl = screen.getByText("Morgan Lee").closest("tr")!;
    const input = within(rowEl).getByPlaceholderText("__");
    fireEvent.change(input, { target: { value: "72" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(screen.getByText("Grade saved for Morgan Lee")).toBeInTheDocument();
  });

  it("focuses the next pending input after saving a grade", () => {
    renderGradingView();
    const morganRow = screen.getByText("Morgan Lee").closest("tr")!;
    const input = within(morganRow).getByPlaceholderText("__");
    fireEvent.change(input, { target: { value: "72" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    const jordanRow = screen.getByText("Jordan Kim").closest("tr")!;
    const nextInput = within(jordanRow).getByPlaceholderText("__");
    expect(nextInput).toHaveFocus();
  });

  it("disables score input and shows absent when toggled", () => {
    renderGradingView();
    const rowEl = screen.getByText("Morgan Lee").closest("tr")!;
    const toggle = within(rowEl).getByRole("switch", { name: "Absent" });
    fireEvent.click(toggle);
    const disabledInput = within(rowEl).queryByPlaceholderText("__");
    expect(disabledInput).toBeNull();
    expect(within(rowEl).getByText("Absent")).toBeInTheDocument();
  });
});
