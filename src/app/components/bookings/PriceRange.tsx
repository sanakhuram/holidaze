import React from "react";

/**
 * Displays the price per night and rating for a venue.
 *
 * @param price - Price per night in euros/dollars.
 * @param rating - Average rating of the venue.
 *
 * @remarks
 * - Simple flex layout with price on the left and rating on the right.
 * - Designed to be reusable wherever price and rating info is needed.
 */

export default function PriceRating({ price, rating }: { price: number; rating: number }) {
  return (
    <div className="flex items-end justify-between">
      <div className="text-amber-100">
        <div className="text-2xl font-bold">${price}</div>
        <div className="text-xs text-amber-200/70">per night</div>
      </div>
      <div className="text-sm text-amber-200/80">⭐ {rating}</div>
    </div>
  );
}
