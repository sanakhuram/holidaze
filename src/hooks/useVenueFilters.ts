"use client";

import { useState } from "react";
import type { Venue } from "@/app/lib/types";

export type VenueFilters = {
  minRating: number;
  minGuests: number;
};

export function useVenueFilters(venues: Venue[]) {
  const [filters, setFilters] = useState<VenueFilters>({
    minRating: 0,
    minGuests: 0,
  });

  const filteredVenues = venues.filter((v) => {
    const matchesRating =
      filters.minRating !== undefined && filters.minRating !== null
        ? v.rating >= filters.minRating
        : true;

    const matchesGuests =
      filters.minGuests !== undefined && filters.minGuests !== null
        ? v.maxGuests >= filters.minGuests
        : true;

    return matchesRating && matchesGuests;
  });

  return { filters, setFilters, filteredVenues };
}
