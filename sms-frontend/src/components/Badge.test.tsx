import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge.js";

describe("Badge", () => {
  const cases = [
    ["pending", "s-badge--pending"],
    ["absent", "s-badge--absent"],
    ["graded", "s-badge--graded"],
  ] as const;

  it.each(cases)("renders the %s variant class", (variant, expectedClass) => {
    render(<Badge variant={variant}>{variant}</Badge>);
    expect(screen.getByText(variant)).toHaveClass("s-badge", expectedClass);
  });
});
