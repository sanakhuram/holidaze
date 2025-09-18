"use client";

import Image from "next/image";
import Link from "next/link";
import type { VenueWithExtras } from "@/app/lib/types";

export default function VenueBookingsCard({ venue }: { venue: VenueWithExtras }) {
  return (
    <div className="from-coffee/90 to-wine/90 rounded-lg border border-amber-300 bg-gradient-to-b p-4 shadow">
      <h3 className="mb-3 text-lg font-semibold text-amber-200">{venue.name}</h3>

      {venue.bookings?.length ? (
        <ul className="space-y-3">
          {venue.bookings.map((b) => (
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
                  <span className="font-medium ">Booking Ref:</span>{" "}
                  <span className="font-mono ">{b.id}</span>
                </div>

                <div>
                  <span className="font-medium ">Guest:</span>{" "}
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
                  <span className="font-medium ">Guests:</span> {b.guests}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-100">No bookings yet for this venue.</p>
      )}
    </div>
  );
}
