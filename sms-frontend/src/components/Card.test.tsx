import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card.js";

describe("Card", () => {
  it("renders children and applies the default padding class", () => {
    render(<Card>content</Card>);
    const card = screen.getByText("content").closest(".s-card");
    expect(card).toHaveClass("s-card", "s-card--default");
  });

  it("applies the lg padding class", () => {
    render(<Card padding="lg">content</Card>);
    expect(screen.getByText("content").closest(".s-card")).toHaveClass(
      "s-card--lg",
    );
  });
});
