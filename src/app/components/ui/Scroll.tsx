"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!containerRef.current) return;
    const { clientWidth } = containerRef.current;
    containerRef.current.scrollBy({
      left: dir === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-amber-600/90 p-2 text-white shadow hover:bg-amber-500"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-amber-600/90 p-2 text-white shadow hover:bg-amber-500"
      >
        <ChevronRight size={20} />
      </button>

      <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-black/30 to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-black/30 to-transparent" />
    </div>
  );
}
