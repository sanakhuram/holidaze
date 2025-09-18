"use client";

import { useState } from "react";
import { usePagination } from "./usePagination";
import { useDebounce } from "./useDebounce";
import { useVenuesQuery } from "./useVenuesQuery";
import { useVenueFilters } from "./useVenueFilters";

export type { VenueFilters } from "./useVenueFilters";

export function useVenueSearch(initialLimit = 16) {
  const { page, setPage } = usePagination(1);
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 400);
  const { venues, meta, loading, error } = useVenuesQuery(page, initialLimit, debouncedQ);
  const { filters, setFilters, filteredVenues } = useVenueFilters(venues);

  return {
    venues: filteredVenues,
    meta,
    loading,
    error,
    q,
    setQ: (val: string) => {
      setPage(1); 
      setQ(val);
    },
    page,
    setPage,
    filters,
    setFilters,
  };
}
