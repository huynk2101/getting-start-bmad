import {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  block?: boolean;
}

export function Skeleton({
  width,
  height,
  block,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined"
        ? (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
          false)
        : false,
  );

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) {
      setReducedMotion(false);
      return;
    }
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const classes = [
    "s-skeleton",
    block && "s-skeleton--block",
    !reducedMotion && "s-skeleton--shimmer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: CSSProperties = { ...style, width, height };

  return (
    <div
      {...rest}
      className={classes}
      style={mergedStyle}
      aria-hidden="true"
    />
  );
}
