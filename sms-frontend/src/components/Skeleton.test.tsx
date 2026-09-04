import { describe, it, expect, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton.js";

function mockMatchMedia(matches: boolean) {
  const listeners: Array<{ type: string; listener: EventListener }> = [];
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (type: string, listener: EventListener) => {
      listeners.push({ type, listener });
    },
    removeEventListener: (type: string, listener: EventListener) => {
      const idx = listeners.findIndex(
        (l) => l.type === type && l.listener === listener,
      );
      if (idx !== -1) listeners.splice(idx, 1);
    },
    dispatchEvent: () => false,
    _listeners: listeners,
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

  it("removes the matchMedia listener on unmount", () => {
    mockMatchMedia(false);
    const { unmount } = render(<Skeleton />);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)") as unknown as {
      _listeners: Array<{ type: string; listener: EventListener }>;
    };
    expect(mq._listeners.length).toBe(1);
    expect(mq._listeners[0].type).toBe("change");
    unmount();
    expect(mq._listeners.length).toBe(0);
  });
});
