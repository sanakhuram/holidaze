"use client";

import SafeImage from "@/app/components/SafeImage";
import type { Venue } from "@/app/lib/types";
import { MapPin, DollarSign } from "lucide-react";
import EditVenueButton from "./EditVenueButton";
import DeleteVenueButton from "./DeleteVenueButton";
import { useRouter } from "next/navigation";

export default function VenueManageCard({ venue }: { venue: Venue }) {
  const router = useRouter();
  const img = venue.media?.[0]?.url ?? null;
  const alt = venue.media?.[0]?.alt ?? venue.name ?? "Venue";
  const city = venue.location?.city ?? "";

  return (
    <div className="rounded-xl border border-amber-600/25 bg-gradient-to-r from-coffee to-wine p-3 text-amber-500 shadow-sm md:p-4">
      <div className="flex justify-between gap-3">
        <div className="h-24 w-24 overflow-hidden rounded-lg md:h-28 md:w-28">
          <SafeImage src={img} alt={alt} className="h-full w-full object-cover" />
        </div>

        <div className="flex items-start gap-2">
          <EditVenueButton venue={venue} />
          <DeleteVenueButton id={venue.id} onDeleted={() => router.refresh()} />
        </div>
      </div>

      <div className="mt-3 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold md:text-lg">{venue.name}</h3>
          {city && <span className="truncate text-xs text-amber-500/70 md:text-sm">• {city}</span>}
        </div>

        <div className="mt-1 line-clamp-2 text-sm text-amber-100/80">{venue.description}</div>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-amber-200/80">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {venue.location?.country || "—"}
          </span>
          <span className="inline-flex items-center gap-1">
            <DollarSign className="h-4 w-4" />€{venue.price}
          </span>
          <span className="inline-flex items-center gap-1">Guests: {venue.maxGuests}</span>
        </div>
        <div className="mt-2 text-xs text-amber-200/70">
          Venue ref: <span className="font-mono">{venue.id}</span>
        </div>
      </div>
    </div>
  );
}
