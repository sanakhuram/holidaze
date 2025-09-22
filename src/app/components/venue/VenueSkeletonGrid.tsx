"use client";

import VenueSkeleton from "./VenueSkeleton";

const CONTAINER = "mx-auto w-full max-w-6xl px-4";

export default function VenueSkeletonGrid() {
  return (
    <div className={`${CONTAINER} grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
      {Array.from({ length: 9 }).map((_, i) => (
        <VenueSkeleton key={i} />
      ))}
    </div>
  );
}
