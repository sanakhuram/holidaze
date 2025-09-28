"use client";

import type { VenueWithExtras } from "@/app/lib/types";
import BookingInfo from "./BookingInfo";
import BookingForm from "./BookingForm";
import BookingMap from "./BookingMap";

/**
 * Booking section for a venue, combining info, booking form, and map.
 *
 * @param venue - Venue data including price, amenities, location, owner, and other details.
 * @param authenticated - Whether the current user is signed in.
 *
 * @remarks
 * - Displays `BookingInfo` with price, rating, location, max guests, and amenities.
 * - Displays `BookingForm` for selecting dates, number of guests, and submitting bookings.
 * - Displays `BookingMap` showing the venue location.
 * - Designed to be placed on a single venue page.
 */

export default function BookingSection({
  venue,
  authenticated,
}: {
  venue: VenueWithExtras;
  authenticated: boolean;
}) {
  return (
    <section className="rounded-sm border border-amber-500 p-5 shadow-sm md:p-6">
      <h2 className="text-wine mb-4 text-center text-xl font-semibold md:mb-6">Book Now</h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <BookingInfo venue={venue} />
        <BookingForm venue={venue} authenticated={authenticated} />
      </div>

      <BookingMap venue={venue} />
    </section>
  );
}
