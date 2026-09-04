import type { ReactNode } from "react";

interface InlineBannerProps {
  variant?: "default" | "note";
  children: ReactNode;
  className?: string;
}

export function InlineBanner({ variant = "default", children, className }: InlineBannerProps) {
  return (
    <div
      className={["s-inline-banner", variant === "note" && "s-inline-banner--note", className]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      {children}
    </div>
  );
}
