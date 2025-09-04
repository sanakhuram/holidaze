"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteVenueButton({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted?: () => void | Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/venues/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete venue");

      await (onDeleted?.() ?? Promise.resolve());
    } catch (err) {
      console.error(err);
      alert("Could not delete venue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      aria-label="Delete venue"
      title="Delete venue"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-400 text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
