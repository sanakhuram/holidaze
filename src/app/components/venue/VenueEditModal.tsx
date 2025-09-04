// src/app/components/VenueEditModal.tsx
"use client";

import ModalShell from "../ui/ModalShell";
import VenueForm from "./VenueForm";
import { toUpdatePayload, type VenueFormValues } from "@/app/lib/venueForm";
import type { Venue } from "@/app/lib/types";
import { useState } from "react";

export default function VenueEditModal({
  open,
  onClose,
  venue,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  venue: Venue;
  onSaved?: () => void | Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const initial: Partial<VenueFormValues> = {
    name: venue.name,
    description: venue.description,
    price: venue.price,
    maxGuests: venue.maxGuests,
    rating: venue.rating,
    media: venue.media?.length ? venue.media : [{ url: "", alt: "" }],
    meta: {
      wifi: !!venue.meta?.wifi,
      parking: !!venue.meta?.parking,
      breakfast: !!venue.meta?.breakfast,
      pets: !!venue.meta?.pets,
    },
    location: {
      address: venue.location?.address,
      city: venue.location?.city,
      zip: venue.location?.zip,
      country: venue.location?.country,
      continent: venue.location?.continent,
      lat: venue.location?.lat,
      lng: venue.location?.lng,
    },
  };

  async function handleSubmit(values: VenueFormValues) {
    setLoading(true);
    try {
      const payload = toUpdatePayload(values);
      const res = await fetch(`/api/venues/${venue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || data?.message || "Update failed");

      await (onSaved?.() ?? Promise.resolve());
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell title="Edit venue" open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="rounded-xl border border-amber-500/20  p-4 text-coffee shadow-sm backdrop-blur">
        <VenueForm
          initial={initial}
          submitLabel="Save changes"
          loading={loading}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </ModalShell>
  );
}
