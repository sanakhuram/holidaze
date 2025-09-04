//* eslint-disable @next/next/no-img-element */
// src/app/components/CreateVenueModal.tsx
"use client";

import { useRouter } from "next/navigation";
import ModalShell from "../ui/ModalShell";
import VenueForm from "./VenueForm";
import { toCreatePayload, type VenueFormValues } from "@/app/lib/venueForm";
import { useState } from "react";

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

      const id = rd?.data?.id as string | undefined;
      await (onCreated?.(id) ?? Promise.resolve());
      onClose();
      if (id) router.push(`/venues/${id}`);
      else router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell title="Create venue" open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="rounded-xl border border-amber-500/20 bg-white/90 p-4 text-coffee shadow-sm backdrop-blur">
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
