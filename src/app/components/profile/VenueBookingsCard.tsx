"use client";

import Image from "next/image";
import Link from "next/link";
import type { VenueWithExtras } from "@/app/lib/types";

export default function VenueBookingsCard({ venue }: { venue: VenueWithExtras }) {
  return (
    <div className="rounded-lg border border-amber-400 p-4 bg-gradient-to-b from-coffee to-wine">
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
                  <span className="font-medium text-coffee">Booking Ref:</span>{" "}
                  <span className="font-mono">{b.id}</span>
                </div>

                <div>
                  <span className="font-medium text-coffee">Guest:</span>{" "}
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
                  {b.customer?.email && (
                    <span className="ml-1 text-slate-500">({b.customer.email})</span>
                  )}
                </div>

                <div>
                  <span className="font-medium text-coffee">Dates:</span>{" "}
                  {new Date(b.dateFrom).toLocaleDateString()} →{" "}
                  {new Date(b.dateTo).toLocaleDateString()}
                </div>

                <div>
                  <span className="font-medium text-coffee">Guests:</span>{" "}
                  {b.guests}
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
