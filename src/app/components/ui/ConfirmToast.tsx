"use client";

import toast from "react-hot-toast";

type ConfirmToastOptions = {
  message: string;
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function confirmToast({
  message,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: ConfirmToastOptions) {
  toast.custom(
    (t) => (
      <div className="flex items-center gap-3 rounded-lg border border-red-400 bg-white p-3 shadow-md">
        <span className="text-sm font-medium text-red-600">{message}</span>
        <div className="ml-auto flex gap-2">
          <button
            className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
            onClick={() => toast.dismiss(t.id)}
          >
            {cancelLabel}
          </button>
          <button
            className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
            onClick={async () => {
              toast.dismiss(t.id);
              await onConfirm();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
}
