"use client";

import { useEffect, useState } from "react";
import { getVenues } from "@/app/lib/api";
import type { Venue } from "@/app/lib/types";
import type { PaginationMeta } from "@/app/components/PaginationControls";
import type { VenueFilters } from "@/app/lib/filters";
import { usePagination } from "./usePagination";

export function useVenueSearch(initialLimit = 24) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<VenueFilters>({});
  const { page, setPage } = usePagination(1);

  const debouncedQ = useDebounce(q, 350);
  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getVenues(page, initialLimit, debouncedQ)
      .then((res) => {
        if (!active) return;

        let items = res?.data ?? [];

        // Client-side filter fallback
        items = items.filter((v) => {
          if (debouncedFilters.guests && v.maxGuests < debouncedFilters.guests) return false;
          if (debouncedFilters.minRating && (v.rating ?? 0) < debouncedFilters.minRating) return false;
          return true;
        });

        const m = res?.meta;
        setMeta(
          m
            ? {
                currentPage: m.currentPage,
                pageCount: m.pageCount,
                isFirstPage: m.isFirstPage ?? m.currentPage <= 1,
                isLastPage: m.isLastPage ?? m.currentPage >= m.pageCount,
              }
            : {
                currentPage: page,
                pageCount: items.length < initialLimit ? page : page + 1,
                isFirstPage: page === 1,
                isLastPage: items.length < initialLimit,
              }
        );

        setVenues(items);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [page, debouncedQ, debouncedFilters, initialLimit]);

  return {
    venues,
    meta,
    loading,
    error,
    q,
    setQ: (val: string) => {
      setPage(1);
      setQ(val);
    },
    filters,
    setFilters,
    page,
    setPage,
  };
}

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}
