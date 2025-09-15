// src/app/components/PaginationControls.tsx
"use client";

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

  const prev = () => onPageChange(Math.max(1, meta.currentPage - 1));
  const next = () => onPageChange(Math.min(meta.pageCount, meta.currentPage + 1));

  return (
    <div className={`mt-8 flex items-center justify-center gap-3 ${className}`}>
      <button
        disabled={isFirst}
        onClick={prev}
        className="rounded-full border px-4 py-2 disabled:opacity-40"
        aria-label="Previous page"
      >
        Prev
      </button>

      <span className="text-brand-brown/80 text-sm">
        Page {meta.currentPage} / {meta.pageCount}
      </span>

      <button
        disabled={isLast}
        onClick={next}
        className="rounded-full border px-4 py-2 disabled:opacity-40"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
