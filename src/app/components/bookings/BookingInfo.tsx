"use client";

import Link from "next/link";
import { MapPin, Star, User } from "lucide-react";
import type { VenueWithExtras } from "@/app/lib/types";
import Amenities from "./Amenities";

export default function BookingInfo({ venue }: { venue: VenueWithExtras }) {
  return (
    <div className="rounded-sm border border-amber-500 p-5 shadow-sm">
      <h3 className="mb-3 text-center text-lg font-bold text-amber-600">Info</h3>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-coffee text-2xl font-bold">${venue.price}</div>
          <div className="text-xs text-neutral-500">per night</div>
        </div>
        <div className="flex items-center gap-1 text-sm text-neutral-700">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>{venue.rating ?? 0}</span>
        </div>
      </div>

      <div className="text-wine mt-3 flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4" />
        <span className="truncate">
          {venue.location?.address || venue.location?.city || venue.location?.country || "Location"}
        </span>
      </div>

      {venue.owner?.name && (
        <div className="flex items-center gap-1 text-sm text-neutral-700">
          <User className="h-4 w-4 text-yellow-900" />
          <Link
            href={`/profiles/${venue.owner.name}`}
            className="text-coffee font-medium hover:underline"
          >
            {venue.owner.name}
          </Link>
        </div>
      )}

      <div className="mt-1 text-sm text-neutral-700">Max guests: {venue.maxGuests}</div>

      <div className="my-5 h-px w-full bg-amber-600/25" />

      <h3 className="mb-2 text-center text-lg font-bold text-amber-600">Amenities</h3>
      <Amenities meta={venue.meta} />
    </div>
  );
}
