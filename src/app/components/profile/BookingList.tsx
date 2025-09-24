"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingWithVenue } from "@/app/lib/types";
import BookingCard from "./BookingCard";
import ViewMoreButton from "../ui/ViewMoreButton";

export default function BookingsList({
  bookings,
  readonly = false,
  initialCount = 3,
  filter = "all",
}: {
  bookings: BookingWithVenue[];
  readonly?: boolean;
  initialCount?: number;
  filter?: "all" | "upcoming" | "past";
}) {
  const router = useRouter();
  const now = Date.now();

  const upcoming = useMemo(
    () =>
      (bookings || [])
        .filter((b) => new Date(b.dateFrom).getTime() >= now)
        .sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime()),
    [bookings, now]
  );

  const past = useMemo(
    () =>
      (bookings || [])
        .filter((b) => new Date(b.dateFrom).getTime() < now)
        .sort((a, b) => new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()),
    [bookings, now]
  );

  let toShow: BookingWithVenue[] = [];
  if (filter === "upcoming") toShow = upcoming;
  else if (filter === "past") toShow = past;
  else toShow = [...upcoming, ...past];

  const [visibleCount, setVisibleCount] = useState(initialCount);
  const visibleBookings = toShow.slice(0, visibleCount);

  if (!toShow.length) {
    return <p className="text-sm text-slate-600">No {filter} bookings.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleBookings.map((b) => (
          <div key={b.id} className={filter === "past" ? "opacity-60 hover:opacity-80" : ""}>
            <BookingCard
              b={b}
              readonly={readonly || filter === "past"}
              onCancelled={() => router.refresh()}
            />
          </div>
        ))}
      </div>

      {toShow.length > initialCount && (
        <div className="mt-4 flex justify-center">
          <ViewMoreButton
            onExpand={() => setVisibleCount(toShow.length)}
            onCollapse={() => setVisibleCount(initialCount)}
          />
        </div>
      )}
    </div>
  );
}
