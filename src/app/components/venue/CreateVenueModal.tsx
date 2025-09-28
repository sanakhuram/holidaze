// src/app/components/CreateVenueModal.tsx
"use client";

import { useRouter } from "next/navigation";
import ModalShell from "../ui/ModalShell";
import VenueForm from "./VenueForm";
import { toCreatePayload, type VenueFormValues } from "@/app/lib/venueForm";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * Modal for creating a new venue.
 *
 * @param open - Whether the modal is visible.
 * @param onClose - Callback triggered when the modal is closed.
 * @param onCreated - Optional callback invoked with the new venue ID after successful creation.
 *
 * @remarks
 * - Uses `VenueForm` to collect venue data.
 * - Converts form values to API payload via `toCreatePayload`.
 * - Sends a POST request to `/api/venues/create`.
 * - Displays toast notifications for loading, success, and error states.
 * - Navigates to the newly created venue or refreshes the page after creation.
 */


export default function CreateVenueModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (venueId?: string) => void | Promise<void>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: VenueFormValues) {
    const toastId = toast.loading("Creating venue…");
    setLoading(true);
    try {
      const payload = toCreatePayload(values);
      const r = await fetch("/api/venues/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const rd = await r.json();
      if (!r.ok) throw new Error(rd?.errors?.[0]?.message || rd?.message || "Create failed");

      toast.success("Venue created successfully 🎉", { id: toastId });

      const id = rd?.data?.id as string | undefined;
      await (onCreated?.(id) ?? Promise.resolve());
      onClose();
      if (id) router.push(`/venues/${id}`);
      else router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong 😬";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell title="Create venue" open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="text-coffee rounded-xl border border-amber-500/20 bg-white/90 p-4 shadow-sm backdrop-blur">
        <VenueForm
          submitLabel="Create venue"
          loading={loading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </ModalShell>
  );
}
