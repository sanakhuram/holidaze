// src/app/components/VenueCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import type { Venue } from "../lib/types";
import { Star, Users, CircleDollarSign } from "lucide-react";
import SafeImage from "./SafeImage";

const PLACEHOLDER = "/placeholder.jpg";

export default function VenueCard({ venue }: { venue: Venue }) {
  const first = venue.media?.[0]?.url || null;
  const alt = venue.media?.[0]?.alt || venue.name || "Venue";
  const [src] = useState<string | null>(first);
  const rating = typeof venue.rating === "number" ? venue.rating : 0;

  return (
    <Link
      href={`/venues/${venue.id}`}
      className="group block rounded-md shadow-xl transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <SafeImage
          src={src}
          alt={alt}
          placeholder={PLACEHOLDER}
          className="h-full w-full rounded-md object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="border-t" />
      <div className="rounded-md bg-background px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-base font-semibold text-wine sm:text-lg">
            {venue.name}
          </h3>
          <span
            className="inline-flex items-center gap-1 text-yellow-700"
            aria-label={`Rating ${rating}`}
            title={`Rating ${rating}`}
          >
            <Star className="h-4 w-4 fill-yellow-300/80 stroke-yellow-700" />
            <span className="text-xs font-medium">{rating.toFixed(1)}</span>
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-700/80">
          {venue.description || "No description provided."}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-neutral-800">
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" />
            {venue.maxGuests ?? 1}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold">
            <CircleDollarSign className="h-4 w-4" />
            {venue.price}
          </span>
        </div>
      </div>
    </Link>
  );
}
