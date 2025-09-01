import React from "react";

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
