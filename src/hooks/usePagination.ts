"use client";
import { useCallback, useState } from "react";

export function usePagination(initial = 1) {
    const [page, setPage] = useState(initial);
    const next = useCallback((pageCount?: number) => {
        setPage((p) => (pageCount ? Math.min(pageCount, p + 1) : p + 1));
    }, []);
    const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
    const go = useCallback((n: number) => setPage(Math.max(1, Math.floor(n))), []);
    return { page, setPage, next, prev, go };
}
