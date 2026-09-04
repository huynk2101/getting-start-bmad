import type { HTMLAttributes, ReactNode } from "react";

type CardPadding = "default" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  children?: ReactNode;
}

export function Card({
  padding = "default",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[`s-card s-card--${padding}`, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
