import type { HTMLAttributes } from "react";
import { Button } from "./Button.js";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  heading: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}

export function EmptyState({
  heading,
  body,
  actionLabel,
  onAction,
  actionDisabled,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      className={["s-empty-state", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <h3 className="s-empty-state__heading display-sm">{heading}</h3>
      {body && <p className="s-empty-state__body">{body}</p>}
      {actionLabel && (
        <Button
          size="md"
          onClick={onAction}
          disabled={actionDisabled || !onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
