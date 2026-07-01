import AdminModal from "./AdminModal";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isWorking?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  isWorking = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AdminModal isOpen={isOpen} title={title} onClose={onCancel}>
      <div className="admin-confirm">
        <p>{message}</p>
        <div className="admin-form__actions">
          <button type="button" className="admin-button--quiet" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-button--danger"
            onClick={onConfirm}
            disabled={isWorking}
          >
            {isWorking ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

export default ConfirmDialog;
