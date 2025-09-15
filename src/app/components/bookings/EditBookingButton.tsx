// src/app/components/EditBookingButton.tsx
"use client";

import { useState, type ReactNode, type MouseEvent } from "react";
import { Pencil } from "lucide-react";
import type { BookingWithVenue } from "@/app/lib/types";
import EditBookingModal from "./EditBookingModal";

export default function EditBookingButton({
  booking,
  onEdited,
  className = "",
  variant = "icon",
  ariaLabel = "Edit booking",
  children,
}: {
  booking: BookingWithVenue;
  onEdited?: () => void | Promise<void>;
  className?: string;
  variant?: "text" | "icon";
  ariaLabel?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  const fallback =
    variant === "text" ? (
      <span className="inline-flex items-center gap-2">
        <Pencil className="h-4 w-4" />
        <span>Edit</span>
      </span>
    ) : (
      <span className="bg-coffee/40 hover:bg-coffee/60 inline-flex h-8 w-8 items-center justify-center rounded-md border border-amber-600/30">
        <Pencil className="h-4 w-4" />
      </span>
    );

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={className}
      >
        {children ?? fallback}
      </button>

      <EditBookingModal
        open={open}
        onClose={() => setOpen(false)}
        booking={booking}
        onSaved={async () => {
          if (onEdited) await onEdited();
          setOpen(false);
        }}
      />
    </>
  );
}
