"use client";

import MapCard from "./MapCard";
import type { VenueWithExtras } from "@/app/lib/types";

export default function BookingMap({ venue }: { venue: VenueWithExtras }) {
  const hasCoords = !!venue.location?.lat && !!venue.location?.lng;
  const q =
    venue.location?.address || venue.location?.city || venue.location?.country || venue.name;

  return (
    <div className="text-wine mt-6 rounded-xl border border-amber-500 p-3 shadow-sm">
      <MapCard
        hasCoords={hasCoords}
        lat={venue.location?.lat}
        lng={venue.location?.lng}
        query={q || venue.name}
        label="Location"
      />
    </div>
  );
}
