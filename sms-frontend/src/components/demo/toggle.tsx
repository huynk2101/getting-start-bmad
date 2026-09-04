interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`s-toggle ${checked ? "s-toggle--on" : "s-toggle--off"}`}
      onClick={() => onChange(!checked)}
    >
      <span className="s-toggle__track">
        <span className="s-toggle__thumb" />
      </span>
      {label && <span className="s-toggle__label">{label}</span>}
    </button>
  );
}
