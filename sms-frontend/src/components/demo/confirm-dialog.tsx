import { useEffect, useRef, useCallback, useId } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const instanceId = useId();
  const titleId = `confirm-dialog-title${instanceId}`;
  const descId = `confirm-dialog-desc${instanceId}`;

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      cancelRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onCancel]
  );

  if (!open) return null;

  return (
    <div className="s-confirm-overlay">
      <div
        ref={dialogRef}
        className="s-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        onKeyDown={handleKeyDown}
      >
        <div className="s-confirm-dialog__content">
          <h2 id={titleId} className="s-confirm-dialog__title display-sm">
            {title}
          </h2>
          {description && (
            <p id={descId} className="s-confirm-dialog__desc">
              {description}
            </p>
          )}
          <div className="s-confirm-dialog__actions">
            <button ref={cancelRef} className="s-confirm-dialog__cancel" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button className="s-button s-button--primary s-button--md" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}