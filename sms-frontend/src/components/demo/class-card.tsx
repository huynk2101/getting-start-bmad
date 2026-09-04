import { type HTMLAttributes } from "react";

interface ClassCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  teacherName: string;
  schedule: string;
  studentCount: number;
  nextExam?: string;
}

export function ClassCard({
  name,
  teacherName,
  schedule,
  studentCount,
  nextExam,
  className,
  ...rest
}: ClassCardProps) {
  return (
    <div className={["s-class-card", className].filter(Boolean).join(" ")} {...rest}>
      <h3 className="s-class-card__title display-sm">{name}</h3>
      <p className="s-class-card__meta">{teacherName} &middot; {schedule}</p>
      <div className="s-class-card__stats">
        <span>{studentCount} students</span>
        {nextExam && <span>Next: {nextExam}</span>}
      </div>
    </div>
  );
}
