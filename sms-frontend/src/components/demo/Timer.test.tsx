import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Timer } from "./timer.js";
import "./timer.css";

function tick(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("Timer (EXAM_TIMER row)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("announces 5-minute threshold and shifts to warning color", () => {
    const onThreshold = vi.fn();
    const onTimeUp = vi.fn();
    render(
      <Timer totalSeconds={330} onTimeUp={onTimeUp} onThreshold={onThreshold} />
    );

    // Advance 30s -> remaining 300 (the 5:00 threshold)
    tick(30 * 1000);

    expect(onThreshold).toHaveBeenCalledWith(300);
    const timer = screen.getByRole("timer");
    expect(timer.className).toContain("s-timer--warning");
  });

  it("announces 1-minute threshold and shifts to danger color", () => {
    const onThreshold = vi.fn();
    const onTimeUp = vi.fn();
    render(
      <Timer totalSeconds={330} onTimeUp={onTimeUp} onThreshold={onThreshold} />
    );

    // Advance 271s -> remaining 59 (< 60, danger threshold at 60)
    tick(271 * 1000);

    expect(onThreshold).toHaveBeenCalledWith(60);
    const timer = screen.getByRole("timer");
    expect(timer.className).toContain("s-timer--danger");
  });

  it("calls onTimeUp when the timer reaches zero", () => {
    const onTimeUp = vi.fn();
    render(<Timer totalSeconds={2} onTimeUp={onTimeUp} />);

    tick(2 * 1000);

    expect(onTimeUp).toHaveBeenCalledTimes(1);
    const timer = screen.getByRole("timer");
    expect(timer.textContent).toBe("0:00");
  });
});
