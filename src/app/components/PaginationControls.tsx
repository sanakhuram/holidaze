"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";

export type PaginationMeta = {
  currentPage: number;
  pageCount: number;
  isFirstPage?: boolean;
  isLastPage?: boolean;
};

export default function PaginationControls({
  meta,
  onPageChange,
  className = "",
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const isFirst = meta.isFirstPage ?? meta.currentPage <= 1;
  const isLast = meta.isLastPage ?? meta.currentPage >= meta.pageCount;

  const changePage = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  const prev = () => changePage(Math.max(1, meta.currentPage - 1));
  const next = () => changePage(Math.min(meta.pageCount, meta.currentPage + 1));
  const backToFirst = () => changePage(1);

  return (
    <div
      className={`mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-amber-700 ${className}`}
    >

      {!isFirst && (
        <button
          onClick={backToFirst}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50"
        >
          <ChevronsLeft className="h-4 w-4" />
          Back to page 1
        </button>
      )}

      <button
        disabled={isFirst}
        onClick={prev}
        className="rounded-full border p-2 hover:bg-amber-50 disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="text-brand-brown/80 text-xs font-medium">
        Page {meta.currentPage} / {meta.pageCount}
      </span>

      <button
        disabled={isLast}
        onClick={next}
        className="rounded-full border p-2 hover:bg-amber-50 disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
