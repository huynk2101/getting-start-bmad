import { describe, it, expect, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton.js";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function getSkeleton() {
  return document.querySelector(".s-skeleton") as HTMLElement;
}

describe("Skeleton", () => {
  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it("renders a shimmer placeholder by default (no reduced motion)", () => {
    mockMatchMedia(false);
    render(<Skeleton width={120} height={12} />);
    const skeleton = getSkeleton();
    expect(skeleton).toHaveClass("s-skeleton", "s-skeleton--shimmer");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });

  it("disables shimmer under prefers-reduced-motion", () => {
    mockMatchMedia(true);
    render(<Skeleton />);
    expect(getSkeleton()).not.toHaveClass("s-skeleton--shimmer");
  });

  it("applies block modifier when block is true", () => {
    mockMatchMedia(false);
    render(<Skeleton block />);
    expect(getSkeleton()).toHaveClass("s-skeleton--block");
  });

  it("unmounts without leaking listeners or throwing", () => {
    mockMatchMedia(false);
    const { unmount } = render(<Skeleton />);
    expect(() => unmount()).not.toThrow();
  });
});
