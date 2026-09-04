import { type HTMLAttributes, type ReactNode } from "react";
import { Badge, type BadgeVariant } from "../Badge.js";

interface ExamCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  date: string;
  time: string;
  className?: string;
  status?: BadgeVariant;
  statusLabel?: string;
  action?: ReactNode;
  countdown?: string;
}

export function ExamCard({
  title,
  date,
  time,
  status,
  statusLabel,
  action,
  countdown,
  className,
  ...rest
}: ExamCardProps) {
  return (
    <div className={["s-exam-card", className].filter(Boolean).join(" ")} {...rest}>
      <div className="s-exam-card__main">
        <div>
          <h3 className="s-exam-card__title">{title}</h3>
          <p className="s-exam-card__meta">{date} {time}</p>
        </div>
        <div className="s-exam-card__right">
          {status && <Badge variant={status}>{statusLabel || status}</Badge>}
          {countdown && <span className="s-exam-card__countdown">{countdown}</span>}
        </div>
      </div>
      {action && <div className="s-exam-card__action">{action}</div>}
    </div>
  );
}
