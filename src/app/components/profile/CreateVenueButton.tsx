"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateVenueModal from "@/app/components/venue/CreateVenueModal";

export default function CreateVenueButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          iconOnly
            ? "bg-wine hover:bg-wine/80 rounded-full p-2 text-white shadow"
            : "hover:bg-wine inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-white"
        }
        aria-label="Create venue"
      >
        <Plus className={iconOnly ? "h-5 w-5" : "h-5 w-5"} aria-hidden />
        {!iconOnly && "Create venue"}
      </button>

      <CreateVenueModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
