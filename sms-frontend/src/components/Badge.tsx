import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "pending" | "absent" | "graded";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
  children?: ReactNode;
}

export function Badge({ variant, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={[`s-badge`, `s-badge--${variant}`, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </span>
  );
}
