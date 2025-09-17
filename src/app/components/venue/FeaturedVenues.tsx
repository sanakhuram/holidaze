"use client";
import BackgroundSection from "../ui/BackgroundSection";
import HorizontalScroller from "../ui/Scroll";
import VenueCard from "../venue/VenueCard";
import type { Venue } from "@/app/lib/types";

const CONTAINER = "mx-auto w-full max-w-6xl px-9";

export default function FeaturedVenues({ pinned }: { pinned: Venue[] }) {
  if (!pinned.length) return null;

return (
  <BackgroundSection dim={0.6}>
    <div className={`${CONTAINER} py-12`}>
      <h2
        className="mb-2 font-extrabold text-amber-400 drop-shadow"
        style={{ fontSize: "clamp(1.5rem, 2vw + 1rem, 3rem)" }}
      >
        Browse Our Featured Venues
      </h2>
      <p className="mb-8 text-sm text-gray-200 drop-shadow-amber-400">
        Hand-picked retreats where sunsets and memories last forever
      </p>
      <HorizontalScroller>
        {pinned.map((v) => (
          <div key={v.id} className="max-w-[280px] min-w-[250px] snap-start">
            <VenueCard venue={v} />
          </div>
        ))}
      </HorizontalScroller>
    </div>
  </BackgroundSection>
);
}
