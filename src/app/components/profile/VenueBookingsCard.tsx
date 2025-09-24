"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { VenueWithExtras } from "@/app/lib/types";

export default function VenueBookingsCard({ venue }: { venue: VenueWithExtras }) {
  const [showAll, setShowAll] = useState(false);

  const bookings = venue.bookings ?? [];
  const visibleBookings = showAll ? bookings : bookings.slice(0, 1);

  return (
    <div className="from-coffee to-wine rounded-lg border border-amber-300 bg-gradient-to-b p-4 shadow">
    
      <h3 className="mb-3 text-lg font-semibold text-amber-200">{venue.name}</h3>

      {visibleBookings.length ? (
        <ul className="space-y-3">
          {visibleBookings.map((b) => (
            <li
              key={b.id}
              className="flex items-start gap-3 rounded-md border border-amber-400/50 bg-amber-50 p-3 text-sm"
            >
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-amber-300">
                <Image
                  src={b.customer?.avatar?.url ?? "/placeholder.jpg"}
                  alt={b.customer?.avatar?.alt ?? b.customer?.name ?? "Guest"}
                  fill
                  className="object-cover object-center"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div>
                  <span className="font-medium">Booking Ref:</span>{" "}
                  <span className="font-mono">{b.id}</span>
                </div>

                <div>
                  <span className="font-medium">Guest:</span>{" "}
                  {b.customer?.name ? (
                    <Link
                      href={`/profiles/${encodeURIComponent(b.customer.name)}`}
                      className="font-semibold text-amber-800 hover:underline"
                    >
                      {b.customer.name}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </div>

                <div>
                  <span className="font-medium">Dates:</span>{" "}
                  {new Date(b.dateFrom).toLocaleDateString()} →{" "}
                  {new Date(b.dateTo).toLocaleDateString()}
                </div>

                <div>
                  <span className="font-medium">Guests:</span> {b.guests}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-200">No bookings yet for this venue.</p>
      )}

      {bookings.length > 1 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 rounded-xl bg-gradient-to-r from-amber-400/30 to-yellow-500/20 px-4 py-1 text-xs text-amber-100 shadow hover:from-amber-300/40 hover:to-orange-400/30"
        >
          {showAll ? "Show Less" : "Show All"}
        </button>
      )}
    </div>
  );
}
