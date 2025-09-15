"use client";

import { useEffect, useState } from "react";
import { getVenues } from "@/app/lib/api";
import type { Venue } from "@/app/lib/types";
import type { PaginationMeta } from "@/app/components/PaginationControls";
import { usePagination } from "./usePagination";

export function useVenueSearch(initialLimit = 16) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const { page, setPage } = usePagination(1);

  const debouncedQ = useDebounce(q, 350);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const isSearching = debouncedQ && debouncedQ.length >= 5;
    const searchTerm = isSearching ? debouncedQ : undefined;

    if (debouncedQ && !isSearching) {
      setLoading(false);
      setVenues([]);
      return;
    }

    getVenues(page, initialLimit, searchTerm)
      .then((res) => {
        if (!active) return;
        setVenues(res?.data ?? []);
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
                pageCount: (res?.data?.length ?? 0) < initialLimit ? page : page + 1,
                isFirstPage: page === 1,
                isLastPage: (res?.data?.length ?? 0) < initialLimit,
              }
        );
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [page, debouncedQ, initialLimit]);

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
