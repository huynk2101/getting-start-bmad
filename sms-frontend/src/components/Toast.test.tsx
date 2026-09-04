import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastProvider, useToast } from "./Toast.js";

function Trigger() {
  const { show } = useToast();
  return (
    <button onClick={() => show("Grade saved for Morgan Lee")}>Show</button>
  );
}

describe("Toast", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows a toast inside the status region on trigger", () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show" }));

    const region = screen.getByRole("status");
    expect(region).toHaveClass("s-toast-wrap");
    expect(region).toHaveTextContent("Grade saved for Morgan Lee");
    expect(screen.getByText("Grade saved for Morgan Lee")).toHaveClass(
      "s-toast",
    );
  });

  it("auto-dismisses the toast after 3 seconds", () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show" }));
    expect(
      screen.getByText("Grade saved for Morgan Lee"),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText("Grade saved for Morgan Lee"),
    ).not.toBeInTheDocument();
  });
});
