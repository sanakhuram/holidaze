"use client";

export default function VenueSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-gray-100">
      <div className="relative aspect-[4/3] w-full rounded-t-lg bg-gray-300" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 rounded bg-gray-300" />
        <div className="h-3 w-1/2 rounded bg-gray-300" />
        <div className="h-3 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}
