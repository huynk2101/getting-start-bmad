import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button.js";

describe("Button", () => {
  it("renders children and applies primary + md classes by default", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveClass("s-button", "s-button--primary", "s-button--md");
  });

  it("applies the size modifier class", () => {
    render(<Button size="sm">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "s-button--sm",
    );
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
