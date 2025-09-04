// src/app/components/EditVenueButton.tsx
"use client";

import { useState, type ReactNode, type MouseEvent, useEffect } from "react";
import { Pencil } from "lucide-react";
import type { Venue } from "@/app/lib/types";
import VenueEditModal from "./VenueEditModal";

type Props = { venue: Venue; venueId?: never } | { venue?: never; venueId: string };

export default function EditVenueButton({
  venue,
  venueId,
  onEdited,
  className = "",
  ariaLabel = "Edit venue",
  children,
}: Props & {
  onEdited?: () => void | Promise<void>;
  className?: string;
  ariaLabel?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [modalVenue, setModalVenue] = useState<Venue | null>(venue ?? null);
  const [loading, setLoading] = useState(false);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  useEffect(() => {
    if (!open || modalVenue || !venueId) return;
    setLoading(true);
    fetch(`/api/venues/${venueId}`)
      .then((r) => r.json())
      .then((data) => setModalVenue(data))
      .catch(() => setModalVenue(null))
      .finally(() => setLoading(false));
  }, [open, venueId, modalVenue]);

  const fallback = (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-amber-400 hover:bg-amber-50">
      <Pencil className="h-4 w-4" />
    </span>
  );

  return (
    <>
      <button onClick={handleClick} aria-label={ariaLabel} title={ariaLabel} className={className}>
        {children ?? fallback}
      </button>

      {open && modalVenue && (
        <VenueEditModal
          open={open}
          onClose={() => setOpen(false)}
          venue={modalVenue}
          onSaved={async () => {
            await (onEdited?.() ?? Promise.resolve());
            setOpen(false);
          }}
        />
      )}

      {open && loading && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 text-white">
          Loading venue…
        </div>
      )}
    </>
  );
}
