"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleTouchMove = () => {};

    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg transition hover:scale-110 hover:from-orange-600 hover:to-amber-500"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg transition hover:scale-110 hover:from-orange-600 hover:to-amber-500"
      >
        <ChevronRight size={18} />
      </button>

      <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-black/30 to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-black/30 to-transparent" />
    </div>
  );
}
