"use client";

import { useEffect, useState } from "react";
import { getVenues } from "@/app/lib/api";
import type { Venue } from "@/app/lib/types";
import type { PaginationMeta } from "@/app/components/ui/PaginationControls";

export function useVenuesQuery(page: number, limit: number, searchTerm?: string) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getVenues(page, limit, searchTerm)
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
                pageCount: (res?.data?.length ?? 0) < limit ? page : page + 1,
                isFirstPage: page === 1,
                isLastPage: (res?.data?.length ?? 0) < limit,
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
  }, [page, limit, searchTerm]);

  return { venues, meta, loading, error };
}
