"use client";

import Image from "next/image";
import Link from "next/link";
import type { VenueWithExtras } from "@/app/lib/types";

export default function VenueBookingsCard({ venue }: { venue: VenueWithExtras }) {
  return (
    <div className="from-coffee to-wine rounded-lg border border-amber-400 bg-gradient-to-b p-4">
      <h3 className="mb-3 font-semibold text-amber-500">{venue.name}</h3>

      {venue.bookings?.length ? (
        <ul className="space-y-3">
          {venue.bookings.map((b) => (
            <li
              key={b.id}
              className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50/90 p-3 text-sm"
            >
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-amber-400">
                <Image
                  src={b.customer?.avatar?.url ?? "/placeholder.jpg"}
                  alt={b.customer?.avatar?.alt ?? b.customer?.name ?? "Guest"}
                  fill
                  className="object-cover object-center"
                  sizes="48px"
                />
              </div>

              <div className="flex-1 space-y-1">
                <div>
                  <span className="text-coffee truncate font-medium">Booking Ref:</span>{" "}
                  <span className="font-mono">{b.id}</span>
                </div>

                <div>
                  <span className="text-coffee font-medium">Guest:</span>{" "}
                  {b.customer?.name ? (
                    <Link
                      href={`/profiles/${encodeURIComponent(b.customer.name)}`}
                      className="text-wine font-semibold hover:underline"
                    >
                      {b.customer.name}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </div>

                <div>
                  <span className="text-coffee font-medium">Dates:</span>{" "}
                  {new Date(b.dateFrom).toLocaleDateString()} →{" "}
                  {new Date(b.dateTo).toLocaleDateString()}
                </div>

                <div>
                  <span className="text-coffee font-medium">Guests:</span> {b.guests}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-600">No bookings yet for this venue.</p>
      )}
    </div>
  );
}
