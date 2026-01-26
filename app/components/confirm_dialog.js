export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const confirmBtnClass =
    variant === "success"
      ? "btn btn-soft btn-accent"
      : variant === "error"
      ? "btn btn-soft btn-error"
      : "btn btn-soft btn-info";

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <p className="font-bold text-lg">{title}</p>

        <div className="py-2">{message}</div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={confirmBtnClass}
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <div
        className="modal-backdrop"
        onClick={onCancel}
      />
    </div>
  );
}