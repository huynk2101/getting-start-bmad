import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "./EmptyState.js";

describe("EmptyState", () => {
  it("renders a centered container with display heading, muted body, and a single primary action", () => {
    const { container } = render(
      <EmptyState
        heading="No classes scheduled today — enjoy the break."
        body="Check back tomorrow."
        actionLabel="Refresh"
        onAction={() => {}}
      />,
    );

    const root = container.querySelector(".s-empty-state");
    expect(root).not.toBeNull();

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent(
      "No classes scheduled today — enjoy the break.",
    );
    expect(heading).toHaveClass("display-sm");
    expect(heading.closest(".s-empty-state")).toBe(root);

    expect(screen.getByText("Check back tomorrow.")).toHaveClass(
      "s-empty-state__body",
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveClass("s-button--primary");
  });

  it("calls onAction when the action is clicked", () => {
    const onAction = vi.fn();
    render(<EmptyState heading="h" actionLabel="Go" onAction={onAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders a disabled action that does not fire when actionDisabled", () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        heading="h"
        actionLabel="Go"
        actionDisabled
        onAction={onAction}
      />,
    );
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onAction).not.toHaveBeenCalled();
  });

  it("disables the action when no onAction handler is provided", () => {
    render(<EmptyState heading="h" actionLabel="Go" />);
    expect(screen.getByRole("button", { name: "Go" })).toBeDisabled();
  });

  it("renders no button when no actionLabel is provided", () => {
    render(<EmptyState heading="h" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
