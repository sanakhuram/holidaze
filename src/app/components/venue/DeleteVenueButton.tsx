"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { confirmToast } from "../ui/ConfirmToast";

export default function DeleteVenueButton({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted?: () => void | Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const toastId = toast.loading("Deleting venue…");
    setLoading(true);
    try {
      const res = await fetch(`/api/venues/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete venue");

      toast.success("Venue deleted 🗑️", { id: toastId });
      await (onDeleted?.() ?? Promise.resolve());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not delete venue.";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={() =>
        confirmToast({
          message: "Are you sure you want to delete this venue?",
          onConfirm: handleDelete,
        })
      }
      disabled={loading}
      aria-label="Delete venue"
      title="Delete venue"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-400 text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
