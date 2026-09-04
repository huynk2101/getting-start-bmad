import { useId, useState, useCallback } from "react";

export interface InlineInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onSubmit"> {
  value?: number | string;
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function InlineInput({
  value: controlledValue,
  placeholder = "__",
  onSubmit,
  disabled,
  error,
  className,
  ref,
  ...rest
}: InlineInputProps) {
  const errorId = useId();
  const [localValue, setLocalValue] = useState(
    controlledValue !== undefined ? String(controlledValue) : ""
  );
  const isEditing = localValue !== "" || controlledValue === undefined;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit(localValue);
      }
      if (e.key === "Escape") {
        setLocalValue(controlledValue !== undefined ? String(controlledValue) : "");
      }
    },
    [localValue, onSubmit, controlledValue]
  );

  const handleBlur = useCallback(() => {
    if (localValue) {
      onSubmit(localValue);
    }
  }, [localValue, onSubmit]);

  const displayValue =
    controlledValue !== undefined ? String(controlledValue) : localValue;

  return (
    <div className="s-inline-input-wrap">
      <input
        ref={ref}
        type="text"
        className={["s-inline-input", error && "s-inline-input--error", className]
          .filter(Boolean)
          .join(" ")}
        value={displayValue}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <span className="s-inline-input__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
