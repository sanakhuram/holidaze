"use client";

import MapCard from "./MapCard";
import type { VenueWithExtras } from "@/app/lib/types";

/**
 * Displays a map for a venue using its coordinates or a query string.
 *
 * @param venue - Venue data including location (lat/lng/address/city/country) and name.
 *
 * @remarks
 * - Uses `MapCard` to render the map.
 * - Falls back to address, city, country, or venue name if coordinates are missing.
 * - Designed to be shown on the booking page for a single venue.
 */

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
