interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showMilestone?: boolean;
}

export function ProgressBar({ value, max = 100, label, showMilestone }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  let milestone = "";
  if (showMilestone) {
    if (pct >= 100) milestone = "All done!";
    else if (pct >= 90) milestone = "Almost there!";
    else if (pct >= 75) milestone = "Just a few more!";
    else if (pct >= 50) milestone = "Halfway there!";
  }

  return (
    <div className="s-progress-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label || "Progress"}>
      <div className="s-progress-bar__track">
        <div className="s-progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      {showMilestone && milestone && (
        <span className="s-progress-bar__milestone" aria-live="polite">{milestone}</span>
      )}
    </div>
  );
}
