//src/app/components/venue/VenueManagerCard.tsx
"use client";

import SafeImage from "@/app/components/SafeImage";
import type { Venue } from "@/app/lib/types";
import { MapPin, DollarSign } from "lucide-react";
import EditVenueButton from "./EditVenueButton";
import DeleteVenueButton from "./DeleteVenueButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";

export default function VenueManageCard({
  venue,
  readonly = false,
  isVenueManager = false, 
}: {
  venue: Venue;
  readonly?: boolean;
  isVenueManager?: boolean; 
}) {
  const router = useRouter();
  const img = venue.media?.[0]?.url ?? null;
  const alt = venue.media?.[0]?.alt ?? venue.name ?? "Venue";
  const city = venue.location?.city ?? "";

  return (
    <div className="from-coffee to-wine rounded-xl border border-amber-600/25 bg-gradient-to-r p-3 text-amber-500 shadow-sm md:p-4">
      <div className="flex justify-between gap-3">
        <Link
          href={`/venues/${String(venue.id)}` as Route}
          className="h-24 w-24 overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:outline-none md:h-28 md:w-28"
        >
          <SafeImage
            src={img}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        </Link>

        {isVenueManager &&
          !readonly && ( 
            <div className="flex items-start gap-2">
              <EditVenueButton venue={venue} />
              <DeleteVenueButton id={venue.id} onDeleted={() => router.refresh()} />
            </div>
          )}
      </div>

      <div className="mt-3 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/venues/${String(venue.id)}` as Route}
            className="truncate text-base font-semibold hover:underline md:text-lg"
          >
            {venue.name}
          </Link>
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
