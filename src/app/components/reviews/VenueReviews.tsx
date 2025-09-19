// src/app/components/reviews/VenueReviews.tsx
"use client";

import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { getVenues } from "@/app/lib/api";
import { pinByOwner } from "@/app/lib/pin";
import type { Venue } from "@/app/lib/types";
import VenueCard from "../venue/VenueCard";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

const reviewSamples = [
  "Amazing stay, would definitely come back!",
  "Very clean and cozy place with a great host.",
  "Perfect location, close to everything.",
  "Good value for money, comfortable beds.",
  "Lovely atmosphere, felt just like home.",
  "Great communication with the host.",
];

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function VenueReviews({ venueId }: { venueId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [featured, setFeatured] = useState<Venue[]>([]);

  useEffect(() => {
    const fake = Array.from({ length: 4 }).map((_, i) => ({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      rating: faker.number.float({ min: 2, max: 5, multipleOf: 0.5 }),
      comment: reviewSamples[i % reviewSamples.length],
      date: faker.date.recent({ days: 30 }).toLocaleDateString("en-US"),
    }));
    setReviews(fake);
  }, [venueId]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await getVenues(1, 20);
        const { pinned, others } = pinByOwner(res.data);

        const shuffledOthers = shuffle(others.filter((v) => v.id !== venueId));

        const picks = [...pinned, ...shuffledOthers].slice(0, 4);

        setFeatured(picks);
      } catch (err) {
        console.error("Failed to load featured venues:", err);
      }
    }
    loadFeatured();
  }, [venueId]);

  return (
    <div className="mt-10 space-y-12">
      <div className="rounded-xl border border-amber-800/30 p-5 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-amber-900">Reviews</h2>
        {reviews.length === 0 && <p className="text-wine text-sm">No reviews yet.</p>}

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-md border border-amber-500 p-3">
              <div className="flex items-center justify-between">
                <span className="text-coffee font-medium">{r.name}</span>

                <span className="text-sm text-amber-600">{r.rating.toFixed(1)} ⭐</span>
              </div>
              <p className="text-wine mt-1 text-sm">{r.comment}</p>
              <p className="text-wine mt-1 text-xs">{r.date}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-coffee mb-6 text-lg font-semibold">Check Our Other Featured Places</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
