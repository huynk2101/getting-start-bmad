import { useEffect, useState, useRef } from "react";

interface TimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  onThreshold?: (remaining: number) => void;
}

export function Timer({ totalSeconds, onTimeUp, onThreshold }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const remainingRef = useRef(totalSeconds);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;
  const onThresholdRef = useRef(onThreshold);
  onThresholdRef.current = onThreshold;
  const announced5 = useRef(false);
  const announced1 = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = remainingRef.current - 1;
      remainingRef.current = next;
      setRemaining(next);

      if (next === 300 && !announced5.current) {
        announced5.current = true;
        onThresholdRef.current?.(next);
      }
      if (next === 60 && !announced1.current) {
        announced1.current = true;
        onThresholdRef.current?.(next);
      }
      if (next <= 0) {
        clearInterval(interval);
        onTimeUpRef.current();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [totalSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${minutes}:${String(seconds).padStart(2, "0")}`;

  let urgencyClass = "";
  if (remaining <= 60) urgencyClass = "s-timer--danger";
  else if (remaining <= 300) urgencyClass = "s-timer--warning";

  const ariaLabel = `${minutes} minutes ${seconds} seconds remaining`;

  return (
    <div
      className={`s-timer ${urgencyClass}`}
      role="timer"
      aria-live="off"
      aria-atomic="true"
      aria-label={ariaLabel}
    >
      {display}
    </div>
  );
}