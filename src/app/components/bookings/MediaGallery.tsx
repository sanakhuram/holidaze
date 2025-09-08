"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Media } from "@/app/lib/types";

const PLACEHOLDER = "/placeholder.jpg";

export default function MediaGallery({ media, name }: { media: Media[]; name: string }) {
  const items = (media?.length ? media : [{ url: PLACEHOLDER, alt: name }]) as Media[];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const main = items[active];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {items.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {items.map((m, i) => {
            const selected = i === active;
            return (
              <button
                key={`${m.url}-${i}`}
                onClick={() => setActive(i)}
                type="button"
                aria-label={`Show image ${i + 1}`}
                aria-pressed={selected}
                className={`relative h-20 w-28 overflow-hidden rounded-lg border ${
                  selected ? "ring-2 ring-brand-orange border-transparent" : "border-black/10"
                } focus:outline-none focus:ring-2 focus:ring-brand-orange`}
              >
                <Image
                  src={m.url}
                  alt={m.alt || `${name} ${i + 1}`}
                  width={112}
                  height={80}
                  className="w-full h-auto object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full overflow-hidden rounded-md"
          aria-label="Open image"
        >
          <Image
            src={main.url}
            alt={main.alt || name}
            width={1200}
            height={800}
            className="w-full h-auto object-cover rounded-md"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 768px, 1024px"
            priority
          />
        </button>

        {items.length > 1 && (
          <div className="mt-3 flex md:hidden gap-2 flex-wrap">
            {items.map((m, i) => {
              const selected = i === active;
              return (
                <button
                  key={`${m.url}-${i}`}
                  onClick={() => setActive(i)}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={selected}
                  className={`relative h-20 w-24 overflow-hidden rounded-lg border ${
                    selected ? "ring-2 ring-brand-orange border-transparent" : "border-black/10"
                  } focus:outline-none focus:ring-2 focus:ring-brand-orange`}
                >
                  <Image
                    src={m.url}
                    alt={m.alt || `${name} ${i + 1}`}
                    width={96}
                    height={80}
                    className="w-full h-auto object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4 "
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={main.url}
              alt={main.alt || name}
              width={1600}
              height={1200}
              className="w-full h-auto object-contain rounded-xl"
              sizes="90vw"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-md bg-amber-500/80 px-2 py-1 text-white hover:bg-wine/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
