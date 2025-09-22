//src/app/profile/CreateVenueButton.tsx

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateVenueModal from "@/app/components/venue/CreateVenueModal";

export default function CreateVenueButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hover:bg-wine inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-white"
      >
        <Plus className="h-5 w-5" aria-hidden />
        Create venue
      </button>

      <CreateVenueModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
