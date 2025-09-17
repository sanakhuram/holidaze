"use client";

import { useState } from "react";
import type { Venue } from "@/app/lib/types";

export type VenueFilters = {
  minRating: number;
  minGuests: number;
  location: string;
};

export function useVenueFilters(venues: Venue[]) {
  const [filters, setFilters] = useState<VenueFilters>({
    minRating: 0,
    minGuests: 0,
    location: "",
  });

  const filteredVenues = venues.filter((v) => {
    const matchesRating = filters.minRating ? v.rating >= filters.minRating : true;
    const matchesGuests = filters.minGuests ? v.maxGuests >= filters.minGuests : true;

    const locationText = [
      v.location?.address,
      v.location?.city,
      v.location?.zip,
      v.location?.country,
      v.location?.continent,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesLocation = filters.location
      ? locationText.includes(filters.location.toLowerCase())
      : true;

    return matchesRating && matchesGuests && matchesLocation;
  });

  return { filters, setFilters, filteredVenues };
}
