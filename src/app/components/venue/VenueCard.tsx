// src/app/components/VenueCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import type { Venue } from "../../lib/types";
import { Star, Users } from "lucide-react";
import SafeImage from "../ui/SafeImage";
import type { Route } from "next";

const PLACEHOLDER = "/placeholder.jpg";

export default function VenueCard({ venue }: { venue: Venue }) {
  const first = venue.media?.[0]?.url || null;
  const alt = venue.media?.[0]?.alt || venue.name || "Venue";
  const [src] = useState<string | null>(first);
  const rating = typeof venue.rating === "number" ? venue.rating : 0;

  return (
    <Link
      href={`/venues/${String(venue.id)}` as Route}
      className="group block rounded-md shadow-2xl transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:outline-none"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-md">
        <SafeImage
          src={src}
          alt={alt}
          placeholder={PLACEHOLDER}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="border-t" />
      <div className="bg-background rounded-md px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-wine truncate text-base font-semibold sm:text-lg">{venue.name}</h2>
          <span
            className="inline-flex items-center gap-1 text-amber-900"
            aria-label={`Rating ${rating}`}
            title={`Rating ${rating}`}
          >
            <Star className="h-4 w-4 fill-amber-400 stroke-amber-700" aria-hidden="true" />
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-700/80">
          {venue.description || "No description provided."}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-wine inline-flex items-center gap-1">
            <Users className="stroke-wine h-4 w-4" aria-hidden="true" />
            <span>{venue.maxGuests ?? 1} guests</span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-green-700">
            <span>${venue.price}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
